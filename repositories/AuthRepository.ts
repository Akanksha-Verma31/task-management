import { User } from 'firebase/auth';

export interface AuthRepository {
  getCurrentUser(): Promise<User | null>;
  signIn(email: string, password: string): Promise<User>;
  signUp(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}