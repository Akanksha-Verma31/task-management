import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { AuthRepository } from '~/repositories/AuthRepository';
import * as SplashScreen from 'expo-splash-screen';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  authRepository,
}: {
  children: React.ReactNode;
  authRepository: AuthRepository;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((user) => {
      setUser(user);
      if (isLoading) {
        setIsLoading(false);
        SplashScreen.hideAsync();
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    isLoading,
    signIn: async (email: string, password: string) => {
      await authRepository.signIn(email, password);
    },
    signUp: async (email: string, password: string) => {
      await authRepository.signUp(email, password);
    },
    signOut: async () => {
      await authRepository.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
