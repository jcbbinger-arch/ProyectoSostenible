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
  onSnapshot,
  FirebaseUser
} from '../firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'admin' | 'student';
  status: 'pending' | 'approved';
  projectId?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  login: () => Promise<void>;
  loginWithRedirect: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Manejar el resultado de la redirección al cargar la app
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect Result Error:", error);
    });

    let unsubProfile: (() => void) | undefined;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Limpiar listener previo si existe
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = undefined;
      }

      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        
        try {
          unsubProfile = onSnapshot(userRef, async (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data() as UserProfile);
              setLoading(false);
            } else {
              // Crear perfil si no existe
              const isAdmin = firebaseUser.email === 'jcbbinger@gmail.com' || firebaseUser.email === 'managerproapp@gmail.com';
              const newProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || '',
                role: isAdmin ? 'admin' : 'student',
                status: isAdmin ? 'approved' : 'pending',
              };
              try {
                await setDoc(userRef, newProfile);
                setProfile(newProfile);
              } catch (err) {
                console.error("Error creating profile:", err);
              }
              setLoading(false);
            }
          }, (error) => {
            console.error("Profile Snapshot Error:", error);
            setLoading(false); // No quedarse atrapado en carga si falla el snapshot
          });
        } catch (err) {
          console.error("Error setting up profile listener:", err);
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

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
    <AuthContext.Provider value={{ user, profile, loading, login, loginWithRedirect, logout }}>
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
