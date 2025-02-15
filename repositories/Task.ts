import { Timestamp } from 'firebase/firestore';
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  priority: Priority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}