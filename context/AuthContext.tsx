import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  signOut, 
  onAuthStateChanged, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  onSnapshot,
  FirebaseUser
} from '../firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'student' | 'assistant';
  status: 'pending' | 'approved';
  projectId?: string;
  impersonatingUid?: string | null;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  realProfile: UserProfile | null; // El perfil real del admin cuando suplanta
  loading: boolean;
  login: () => Promise<void>;
  loginWithRedirect: () => Promise<void>;
  logout: () => Promise<void>;
  impersonateUser: (uid: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [realProfile, setRealProfile] = useState<UserProfile | null>(null);
  const [impersonatedProfile, setImpersonatedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Manejar el resultado de la redirección al cargar la app
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect Result Error:", error);
    });

    let unsubProfile: (() => void) | undefined;
    let unsubImpersonated: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Limpiar listeners previos
      if (unsubProfile) unsubProfile();
      if (unsubImpersonated) unsubImpersonated();
      unsubProfile = undefined;
      unsubImpersonated = undefined;

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        try {
          unsubProfile = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              const isAdminEmail = firebaseUser.email === 'jcbbinger@gmail.com' || firebaseUser.email === 'managerproapp@gmail.com';
              
              // Force admin role if email matches
              if (isAdminEmail && (data.role !== 'admin' || data.status !== 'approved')) {
                const updatedProfile = { ...data, role: 'admin' as const, status: 'approved' as const };
                try {
                  await updateDoc(userRef, updatedProfile);
                } catch (err) {
                  console.error("Error forcing admin role:", err);
                  setRealProfile(updatedProfile);
                }
              } else {
                setRealProfile(data);
              }

              // Si el admin está suplantando a alguien
              if (data.impersonatingUid) {
                if (unsubImpersonated) unsubImpersonated();
                unsubImpersonated = onSnapshot(doc(db, 'users', data.impersonatingUid), (impSnap) => {
                  if (impSnap.exists()) {
                    setImpersonatedProfile(impSnap.data() as UserProfile);
                  } else {
                    setImpersonatedProfile(null);
                  }
                });
              } else {
                setImpersonatedProfile(null);
                if (unsubImpersonated) {
                  unsubImpersonated();
                  unsubImpersonated = undefined;
                }
              }

              setLoading(false);
            } else {
              // Crear perfil si no existe
              // Por defecto, todos los nuevos perfiles entran como 'student' y 'pending'
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || '',
                role: 'student',
                status: 'pending',
              };
              try {
                await setDoc(userRef, newProfile);
                setRealProfile(newProfile);
              } catch (err) {
                console.error("Error creating profile:", err);
              }
              setLoading(false);
            }
          }, (error) => {
            console.error("Profile Snapshot Error:", error);
            setLoading(false);
          });
        } catch (err) {
          console.error("Error setting up profile listener:", err);
          setLoading(false);
        }
      } else {
        setRealProfile(null);
        setImpersonatedProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
      if (unsubImpersonated) unsubImpersonated();
    };
  }, []);

  // El perfil expuesto es el suplantado si existe, si no el real
  useEffect(() => {
    setProfile(impersonatedProfile || realProfile);
  }, [impersonatedProfile, realProfile]);

  const impersonateUser = async (targetUid: string | null) => {
    if (!realProfile || realProfile.role !== 'admin') return;
    
    try {
      const userRef = doc(db, 'users', realProfile.uid);
      if (targetUid) {
        // Obtener el projectId del usuario a suplantar
        const targetSnap = await getDoc(doc(db, 'users', targetUid));
        const targetData = targetSnap.data() as UserProfile;
        
        await updateDoc(userRef, { 
          impersonatingUid: targetUid,
          projectId: targetData.projectId || null
        });
      } else {
        await updateDoc(userRef, { 
          impersonatingUid: null,
          projectId: null 
        });
      }
    } catch (error) {
      console.error("Error toggling impersonation:", error);
    }
  };

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithRedirect = async () => {
    await signInWithRedirect(auth, googleProvider);
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, realProfile, loading, login, loginWithRedirect, logout, impersonateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
