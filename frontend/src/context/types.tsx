import { ReactNode } from "react";

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  role?: string; // e.g., "admin", "user", etc.
  projects: Project[];
};

export type Project = {
  id: number;
  title: string;
  description: string;
  createdAt: string; // Change to `Date` if using Date objects
  users: User[];
};

export type Column = {
  id: number;
  name: string;
  projectId: number;
  tasks: Task[];
};

export type Task = {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "Low" | "Medium" | "High";
  columnId: number;
  createdAt?: string;
  ownerId?: number;
  owner?: User;
  taskAssignees?: TaskAssignee[];
  attachments?: Attachment[];
  subtasks?: Subtask[];
};

export type Subtask = {
  id: number;
  taskId: number;
  task: Task;
  title: string;
  isCompleted: boolean;
  completedBy: string | null;
  completedAt: string | null;
};

export type TaskAssignee = {
  id: number;
  taskId: number;
  task: Task;
  userId: number;
  user: User;
};

export type Attachment = {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  uploadedAt: string;
  taskId: number;
  task: Task;
};

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  ready: boolean;
};

export type UserContextProviderProps = {
  children: ReactNode;
};

export type RegisterErrors = {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type LoginErrors = {
  email?: string;
  password?: string;
};

export type NewProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  refreshProjects: () => void;
};
export type EditProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  refreshProjects: () => void;
  selectedProject: Project | null;
};

export type ProjectsTableProps = {
  projects: Project[];
};
