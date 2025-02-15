import { db } from '~/utils/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { Task, Priority } from './Task';
import { TaskRepository } from './TaskRepository';

export class FirestoreTaskRepository implements TaskRepository {
  private userId: string;
  private tasksCollection = 'tasks';

  constructor(userId: string) {
    this.userId = userId;
  }

  private convertFromFirestore(doc: any): Task {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate.toDate(),
      priority: data.priority as Priority,
      completed: data.completed,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  async getTasks(): Promise<Task[]> {
    const q = query(
      collection(db, this.tasksCollection),
      where('userId', '==', this.userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(this.convertFromFirestore);
  }

  async createTask(task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const taskData = {
      ...task,
      userId: this.userId,
      dueDate: task.dueDate,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, this.tasksCollection), taskData);
    const docSnap = await getDoc(docRef);
    return this.convertFromFirestore(docSnap);
  }

  async updateTask(id: string, taskUpdate: Partial<Task>): Promise<Task> {
    const taskRef = doc(db, this.tasksCollection, id);
    const updateData = {
      ...taskUpdate,
      updatedAt: serverTimestamp(),
    };

    if (taskUpdate.dueDate) {
      updateData.dueDate = taskUpdate.dueDate;
    }

    await updateDoc(taskRef, updateData);
    const docSnap = await getDoc(taskRef);
    return this.convertFromFirestore(docSnap);
  }

  async deleteTask(id: string): Promise<void> {
    const taskRef = doc(db, this.tasksCollection, id);
    await deleteDoc(taskRef);
  }

  async toggleComplete(id: string): Promise<Task> {
    const taskRef = doc(db, this.tasksCollection, id);
    const docSnap = await getDoc(taskRef);
    const task = this.convertFromFirestore(docSnap);
    
    return this.updateTask(id, { completed: !task.completed });
  }
}