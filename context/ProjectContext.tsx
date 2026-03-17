
import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { ProjectState, Zone, Dish, TeamMember, MenuPrototype, Task6Roles, PeerReview } from '../types';
import { INITIAL_STATE } from '../constants';
import { db, doc, onSnapshot, updateDoc, setDoc, collection, query, where, getDocs } from '../firebase';
import { useAuth } from './AuthContext';

interface ProjectContextType {
  state: ProjectState;
  loading: boolean;
  setCurrentUser: (id: string | null) => void;
  createProject: (name: string) => Promise<string>;
  joinProject: (code: string) => Promise<void>;
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
        coEvaluations: Array.isArray(loadedData.coEvaluations) ? loadedData.coEvaluations : []
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
    if (!user) throw new Error("Must be logged in");
    
    const projectId = doc(collection(db, 'projects')).id;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newProject = {
      ...INITIAL_STATE,
      id: projectId,
      name,
      code,
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'projects', projectId), newProject);
    await updateDoc(doc(db, 'users', user.uid), { projectId });
    
    return code;
  };

  const joinProject = async (code: string) => {
    if (!user) throw new Error("Must be logged in");
    
    const q = query(collection(db, 'projects'), where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Invalid project code");
    }

    const projectId = querySnapshot.docs[0].id;
    await updateDoc(doc(db, 'users', user.uid), { projectId });
  };

  const setCurrentUser = (id: string | null) => setState(prev => ({ ...prev, currentUser: id }));

  const updateSchoolSettings = (name: string, year: string) => setState(prev => ({ ...prev, schoolName: name, academicYear: year }));
  const updateImage = (type: 'schoolLogo' | 'groupPhoto', base64: string | null) => setState(prev => ({ ...prev, [type]: base64 }));
  const updateTeamName = (name: string) => setState(prev => ({ ...prev, teamName: name }));
  const updateTeamMembers = (members: TeamMember[]) => setState(prev => ({ ...prev, team: members }));
  const selectZone = (zone: Zone) => setState(prev => ({ ...prev, selectedZone: zone }));
  const updateZoneJustification = (text: string) => setState(prev => ({ ...prev, zoneJustification: text }));
  const assignTask = (taskId: number, memberId: string | null) => setState(prev => ({ ...prev, task2: { ...prev.task2, tasks: prev.task2.tasks.map(t => t.id === taskId ? { ...t, assignedToId: memberId } : t) } }));
  const updateTaskContent = (taskId: number, content: string) => setState(prev => ({ ...prev, task2: { ...prev.task2, tasks: prev.task2.tasks.map(t => t.id === taskId ? { ...t, content: content } : t) } }));
  const updateConcept = (key: keyof ProjectState['concept'], value: any) => setState(prev => ({ ...prev, concept: { ...prev.concept, [key]: value } }));
  const updateMission = (role: keyof ProjectState['missions'], data: any) => setState(prev => ({ ...prev, missions: { ...prev.missions, [role]: { ...prev.missions[role], ...data } } }));
  const addDish = (dish: Dish) => setState(prev => ({ ...prev, dishes: [...prev.dishes, { ...dish, author: dish.author || state.currentUser || '' }] }));
  const removeDish = (id: string) => setState(prev => ({ ...prev, dishes: prev.dishes.filter(d => d.id !== id) }));
  const updateDish = (dish: Dish) => setState(prev => ({ ...prev, dishes: prev.dishes.map(d => d.id === dish.id ? dish : d) }));
  const updateMenuPrototype = (data: Partial<MenuPrototype>) => setState(prev => ({ ...prev, menuPrototype: { ...prev.menuPrototype, ...data } }));
  const updateTask6Roles = (roles: Partial<Task6Roles>) => setState(prev => ({ ...prev, task6: { ...prev.task6, ...roles } }));
  const savePeerReview = (review: PeerReview) => setState(prev => ({ ...prev, coEvaluations: [...prev.coEvaluations.filter(r => !(r.evaluatorId === review.evaluatorId && r.targetId === review.targetId)), review] }));
  
  const resetProject = () => {
    setState(INITIAL_STATE);
  };

  return (
    <ProjectContext.Provider value={{ 
      state, loading, setCurrentUser, createProject, joinProject, updateSchoolSettings, updateImage,
      updateTeamName, updateTeamMembers, selectZone, updateZoneJustification, assignTask, updateTaskContent,
      updateConcept, updateMission, addDish, removeDish, updateDish, updateMenuPrototype, updateTask6Roles,
      savePeerReview, resetProject 
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
