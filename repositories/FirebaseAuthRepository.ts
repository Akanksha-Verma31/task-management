import { auth } from '~/utils/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { AuthRepository } from './AuthRepository';

export class FirebaseAuthRepository implements AuthRepository {
  getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }

  async signIn(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  async signUp(email: string, password: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  }

  async signOut(): Promise<void> {
    await signOut(auth);
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }
}