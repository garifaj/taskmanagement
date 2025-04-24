import { useContext } from "react";
import { ProjectContext } from "../context/project/ProjectContext";

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
