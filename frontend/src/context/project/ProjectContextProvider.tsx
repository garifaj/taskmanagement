import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/config";

import { Project } from "../types";
import { ProjectContext } from "./ProjectContext";

export const ProjectContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userProjects, setUserProjects] = useState<Project[]>([]);

  const fetchUserProjects = () => {
    axios
      .get(`${API_BASE_URL}/projects/user-projects`, { withCredentials: true })
      .then((res) => setUserProjects(res.data))
      .catch((err) => console.error("Error fetching projects", err));
  };

  const deleteProject = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${id}`);
      setUserProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  return (
    <ProjectContext.Provider
      value={{ userProjects, fetchUserProjects, deleteProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
