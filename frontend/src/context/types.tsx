import { ReactNode } from "react";

export type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  projects: Project[];
};

export type Project = {
  id: number;
  title: string;
  description: string;
  createdAt: string; // Change to `Date` if using Date objects
  users: User[];
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
