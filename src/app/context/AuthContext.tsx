// ============================================
// File 2: teacher-portal/src/app/context/AuthContext.tsx
// ============================================
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, getUserData } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

interface UserData {
  uid: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  subject?: string;
  avatar?: string;
  phone?: string;
  experience?: string;
  qualification?: string;
  [key: string]: any;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  setUserData: (data: UserData) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const data = await getUserData(user.uid);
        setUserData(data as UserData);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { currentUser, userData, loading, setUserData };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}