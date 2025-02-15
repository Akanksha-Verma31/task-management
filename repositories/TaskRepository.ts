import { Task } from './Task';

export interface TaskRepository {
    getTasks(): Promise<Task[]>;
    createTask(task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Task>;
    updateTask(id: string, task: Partial<Task>): Promise<Task>;
    deleteTask(id: string): Promise<void>;
    toggleComplete(id: string): Promise<Task>;
}