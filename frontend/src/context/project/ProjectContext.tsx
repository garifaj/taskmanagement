import { createContext } from "react";
import { Project } from "../types";

export type ProjectContextType = {
  userProjects: Project[];
  fetchUserProjects: () => void;
  deleteProject: (id: number) => void;
};

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);
