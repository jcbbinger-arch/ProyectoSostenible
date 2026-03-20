
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { ProjectState, Zone, Dish, TeamMember, MenuPrototype, Task6Roles, PeerReview, SeasonalProductContribution } from '../types';
import { INITIAL_STATE } from '../constants';
import { db, doc, onSnapshot, updateDoc, setDoc, collection, query, where, getDocs } from '../firebase';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  state: ProjectState;
  loading: boolean;
  setCurrentUser: (id: string | null) => void;
  createProject: (name: string) => Promise<string>;
  joinProject: (code: string) => Promise<void>;
  claimTeamMember: (tempId: string) => Promise<void>;
  joinTeamAsNewMember: (name: string) => Promise<void>;
  updateSchoolSettings: (name: string, year: string) => void;
  updateImage: (type: 'schoolLogo' | 'groupPhoto', base64: string | null) => void;
  updateTeamName: (name: string) => void;
  updateTeamMembers: (members: TeamMember[]) => void;
  selectZone: (zone: Zone) => void;
  updateZoneJustification: (text: string) => void;
  assignTask: (taskId: number, memberId: string | null) => void;
  updateTaskContent: (taskId: number, content: string) => void;
  updateConcept: (key: keyof ProjectState['concept'], value: any) => void;
  updateMission: (role: keyof ProjectState['missions'], data: any) => void;
  addDish: (dish: Dish) => void;
  removeDish: (id: string) => void;
  updateDish: (dish: Dish) => void;
  updateMenuPrototype: (data: Partial<MenuPrototype>) => void;
  updateTask6Roles: (roles: Partial<Task6Roles>) => void;
  updateSeasonalProducts: (data: Partial<SeasonalProductContribution>) => void;
  updateInterimReport: (data: any) => void;
  savePeerReview: (review: PeerReview) => void;
  resetProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const sanitizeState = (loadedData: any): ProjectState => {
    if (!loadedData) return INITIAL_STATE;
    
    const safeTask6 = { 
        designerIds: loadedData.task6?.designerIds || [],
        artisanIds: loadedData.task6?.artisanIds || [],
        editorIds: loadedData.task6?.editorIds || []
    };

    return {
        ...INITIAL_STATE,
        ...loadedData,
        concept: { ...INITIAL_STATE.concept, ...(loadedData.concept || {}) },
        missions: { ...INITIAL_STATE.missions, ...(loadedData.missions || {}) },
        task2: { ...INITIAL_STATE.task2, ...(loadedData.task2 || {}) },
        task6: safeTask6,
        menuPrototype: { ...INITIAL_STATE.menuPrototype, ...(loadedData.menuPrototype || {}) },
        dishes: Array.isArray(loadedData.dishes) ? loadedData.dishes : [],
        team: Array.isArray(loadedData.team) ? loadedData.team : [],
        seasonalProducts: Array.isArray(loadedData.seasonalProducts) ? loadedData.seasonalProducts : [],
        coEvaluations: Array.isArray(loadedData.coEvaluations) ? loadedData.coEvaluations : [],
        interimReport: {
            ...INITIAL_STATE.interimReport,
            ...(loadedData.interimReport || {}),
            introduction: { ...INITIAL_STATE.interimReport.introduction, ...(loadedData.interimReport?.introduction || {}) },
            analysis: { 
                ...INITIAL_STATE.interimReport.analysis, 
                ...(loadedData.interimReport?.analysis || {}),
                companies: { ...INITIAL_STATE.interimReport.analysis.companies, ...(loadedData.interimReport?.analysis?.companies || {}) },
                products: { ...INITIAL_STATE.interimReport.analysis.products, ...(loadedData.interimReport?.analysis?.products || {}) },
                ods: { ...INITIAL_STATE.interimReport.analysis.ods, ...(loadedData.interimReport?.analysis?.ods || {}) },
                laborRisks: { ...INITIAL_STATE.interimReport.analysis.laborRisks, ...(loadedData.interimReport?.analysis?.laborRisks || {}) },
                conclusions: { ...INITIAL_STATE.interimReport.analysis.conclusions, ...(loadedData.interimReport?.analysis?.conclusions || {}) }
            },
            development: { ...INITIAL_STATE.interimReport.development, ...(loadedData.interimReport?.development || {}) }
        }
    };
};

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, user } = useAuth();
  const [state, setState] = useState<ProjectState>(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const isInitialMount = useRef(true);
  const remoteUpdateInProgress = useRef(false);

  // Sync with Firestore
  useEffect(() => {
    if (!profile?.projectId) {
      setState(INITIAL_STATE);
      setLoading(false);
      return;
    }

    setLoading(true);
    const projectRef = doc(db, 'projects', profile.projectId);
    
    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        remoteUpdateInProgress.current = true;
        setState(sanitizeState(docSnap.data()));
        remoteUpdateInProgress.current = false;
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [profile?.projectId]);

  // Push local changes to Firestore (Debounced)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (remoteUpdateInProgress.current || !profile?.projectId) return;

    const timeoutId = setTimeout(async () => {
      try {
        const projectRef = doc(db, 'projects', profile.projectId!);
        // We only update the data fields, not the metadata
        const { id, code, createdBy, createdAt, ...dataToSync } = state;
        await updateDoc(projectRef, dataToSync as any);
      } catch (error) {
        console.error("Error syncing with Firestore:", error);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [state, profile?.projectId]);

  const createProject = async (name: string) => {
    if (!user) throw new Error("Debes iniciar sesión");
    
    const projectId = doc(collection(db, 'projects')).id;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const creatorMember = {
      id: user.uid,
      name: profile?.displayName || user.displayName || 'Coordinador',
      role: 'Estudiante',
      isCoordinator: true
    };

    const newProject = {
      ...INITIAL_STATE,
      id: projectId,
      name,
      code,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      team: [creatorMember]
    };

    await setDoc(doc(db, 'projects', projectId), newProject);
    await updateDoc(doc(db, 'users', user.uid), { projectId });
    
    return code;
  };

  const joinProject = async (code: string) => {
    if (!user) throw new Error("Debes iniciar sesión");
    
    const q = query(collection(db, 'projects'), where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Código de proyecto inválido");
    }

    const projectDoc = querySnapshot.docs[0];
    const projectId = projectDoc.id;
    
    // Solo actualizamos el perfil del usuario para vincularlo al proyecto
    // La identificación con un miembro del equipo se hará en el Dashboard
    await updateDoc(doc(db, 'users', user.uid), { projectId });
  };

  const claimTeamMember = async (tempId: string) => {
    if (!user || !profile?.projectId) return;
    
    const team = [...state.team];
    const index = team.findIndex(m => m.id === tempId);
    if (index === -1) return;

    const member = team[index];
    team[index] = {
      ...member,
      id: user.uid,
      // Mantenemos el nombre que ya estaba o usamos el del perfil si se prefiere
      // Por consistencia con la petición del usuario, mantenemos el nombre del equipo pre-creado
    };

    await updateDoc(doc(db, 'projects', profile.projectId), { team });
    setState(prev => ({ ...prev, team, currentUser: user.uid }));
  };

  const joinTeamAsNewMember = async (name: string) => {
    if (!user || !profile?.projectId) return;
    if (state.team.length >= 5) throw new Error("Equipo completo");

    const newMember: TeamMember = {
      id: user.uid,
      name: name,
      isCoordinator: state.team.length === 0
    };

    const newTeam = [...state.team, newMember];
    await updateDoc(doc(db, 'projects', profile.projectId), { team: newTeam });
    setState(prev => ({ ...prev, team: newTeam, currentUser: user.uid }));
  };

  const setCurrentUser = (id: string | null) => setState(prev => ({ ...prev, currentUser: id }));

  const updateSchoolSettings = (name: string, year: string) => setState(prev => ({ ...prev, schoolName: name, academicYear: year }));
  const updateImage = (type: 'schoolLogo' | 'groupPhoto', base64: string | null) => setState(prev => ({ ...prev, [type]: base64 }));
  const updateTeamName = (name: string) => setState(prev => ({ ...prev, teamName: name }));
  const updateTeamMembers = (members: TeamMember[]) => setState(prev => ({ ...prev, team: members }));
  const selectZone = (zone: Zone) => setState(prev => ({ ...prev, selectedZone: zone }));
  const updateZoneJustification = (text: string) => setState(prev => ({ ...prev, zoneJustification: text }));
  const assignTask = (taskId: number, memberId: string | null) => setState(prev => ({ ...prev, task2: { ...prev.task2, tasks: prev.task2.tasks.map(t => t.id === taskId ? { ...t, assignedToId: memberId } : t) } }));
  const updateTaskContent = (taskId: number, content: string) => {
    setState(prev => {
      const task = prev.task2.tasks.find(t => t.id === taskId);
      if (task && task.assignedToId !== prev.currentUser) {
        console.warn("Permission denied: You can only edit your assigned tasks.");
        return prev;
      }
      return { ...prev, task2: { ...prev.task2, tasks: prev.task2.tasks.map(t => t.id === taskId ? { ...t, content: content } : t) } };
    });
  };
  const updateConcept = (key: keyof ProjectState['concept'], value: any) => setState(prev => ({ ...prev, concept: { ...prev.concept, [key]: value } }));
  const updateMission = (role: keyof ProjectState['missions'], data: any) => setState(prev => ({ ...prev, missions: { ...prev.missions, [role]: { ...prev.missions[role], ...data } } }));
  const addDish = (dish: Dish) => setState(prev => ({ ...prev, dishes: [...prev.dishes, { ...dish, author: dish.author || state.currentUser || '' }] }));
  const removeDish = (id: string) => {
    setState(prev => {
      const dish = prev.dishes.find(d => d.id === id);
      if (dish && dish.author !== prev.currentUser) {
        console.warn("Permission denied: You can only remove your own dishes.");
        return prev;
      }
      return { ...prev, dishes: prev.dishes.filter(d => d.id !== id) };
    });
  };
  const updateDish = (dish: Dish) => {
    setState(prev => {
      const existing = prev.dishes.find(d => d.id === dish.id);
      if (existing && existing.author !== prev.currentUser) {
        console.warn("Permission denied: You can only update your own dishes.");
        return prev;
      }
      return { ...prev, dishes: prev.dishes.map(d => d.id === dish.id ? dish : d) };
    });
  };
  const updateMenuPrototype = (data: Partial<MenuPrototype>) => {
    setState(prev => {
      const currentUserMember = prev.team.find(m => m.id === prev.currentUser);
      const isCoordinator = currentUserMember?.isCoordinator || false;
      const isDesigner = prev.task6.designerIds.includes(prev.currentUser || '');
      const isArtisan = prev.task6.artisanIds.includes(prev.currentUser || '');
      const noRolesAssigned = prev.task6.designerIds.length === 0 && prev.task6.artisanIds.length === 0 && prev.task6.editorIds.length === 0;

      if (isCoordinator || noRolesAssigned) {
        return { ...prev, menuPrototype: { ...prev.menuPrototype, ...data } };
      }

      const keys = Object.keys(data);
      const canEditDigital = isDesigner && (keys.includes('digitalLink') || keys.includes('digitalDescription'));
      const canEditPhysical = isArtisan && (keys.includes('physicalPhoto') || keys.includes('physicalDescription'));
      
      if (canEditDigital || canEditPhysical) {
        return { ...prev, menuPrototype: { ...prev.menuPrototype, ...data } };
      }

      return prev;
    });
  };
  const updateTask6Roles = (roles: Partial<Task6Roles>) => {
    setState(prev => {
      const currentUserMember = prev.team.find(m => m.id === prev.currentUser);
      if (!currentUserMember?.isCoordinator) return prev;
      return { ...prev, task6: { ...prev.task6, ...roles } };
    });
  };
  
  const updateInterimReport = (data: any) => {
    setState(prev => {
      const currentUserMember = prev.team.find(m => m.id === prev.currentUser);
      const isCoordinator = currentUserMember?.isCoordinator || false;
      const isEditor = prev.task6.editorIds.includes(prev.currentUser || '');
      const noRolesAssigned = prev.task6.designerIds.length === 0 && prev.task6.artisanIds.length === 0 && prev.task6.editorIds.length === 0;

      if (isCoordinator || isEditor || noRolesAssigned) {
        return { ...prev, interimReport: { ...prev.interimReport, ...data } };
      }
      return prev;
    });
  };

  const updateSeasonalProducts = (data: Partial<SeasonalProductContribution>) => {
      if (!state.currentUser) return;
      setState(prev => {
          const existing = prev.seasonalProducts.find(p => p.memberId === state.currentUser);
          if (existing) {
              return {
                  ...prev,
                  seasonalProducts: prev.seasonalProducts.map(p => 
                      p.memberId === state.currentUser ? { ...p, ...data } : p
                  )
              };
          } else {
              return {
                  ...prev,
                  seasonalProducts: [...prev.seasonalProducts, {
                      memberId: state.currentUser!,
                      productList: '',
                      sustainability: '',
                      impactAnalysis: '',
                      sources: [],
                      ...data
                  }]
              };
          }
      });
  };

  const savePeerReview = (review: PeerReview) => {
    setState(prev => {
      if (review.evaluatorId !== prev.currentUser) return prev;
      return { ...prev, coEvaluations: [...prev.coEvaluations.filter(r => !(r.evaluatorId === review.evaluatorId && r.targetId === review.targetId)), review] };
    });
  };
  
  const resetProject = () => {
    setState(INITIAL_STATE);
  };

  return (
    <ProjectContext.Provider value={{ 
      state, loading, setCurrentUser, createProject, joinProject, claimTeamMember, joinTeamAsNewMember, updateSchoolSettings, updateImage,
      updateTeamName, updateTeamMembers, selectZone, updateZoneJustification, assignTask, updateTaskContent,
      updateConcept, updateMission, addDish, removeDish, updateDish, updateMenuPrototype, updateTask6Roles,
      updateSeasonalProducts, updateInterimReport, savePeerReview, resetProject 
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProject must be used within a ProjectProvider');
  return context;
};
