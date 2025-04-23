import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../utils/config";
import { ProjectContext } from "../context/ProjectContext";
import { Project } from "./types";

export const ProjectContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchUserProjects = () => {
    axios
      .get(`${API_BASE_URL}/projects/user-projects`, { withCredentials: true })
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects", err));
  };

  const deleteProject = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/projects/${id}`);
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Error deleting project", error);
    }
  };

  useEffect(() => {
    fetchUserProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{ projects, fetchUserProjects, deleteProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
