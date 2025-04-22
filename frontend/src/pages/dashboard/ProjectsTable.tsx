import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/config";
import { Project } from "../../context/types";

const ProjectsTable = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/projects/user-projects`, {
          withCredentials: true,
        });
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-300">
      <table className="min-w-full divide-y-2 divide-gray-200">
        <thead className="text-left bg-gray-150">
          <tr className="*:font-medium *:text-gray-900">
            <th className="px-3 py-3 whitespace-nowrap">Project Name</th>
            <th className="px-3 py-2 whitespace-nowrap">Description</th>
            <th className="px-3 py-2 whitespace-nowrap">Created At</th>
            <th className="px-3 py-2 whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {projects.map((project: Project) => (
            <tr key={project.id} className="bg-white hover:bg-gray-50">
              <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900">
                {project.title}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                {project.description || "—"}
              </td>
              <td className="px-3 py-2 whitespace-nowrap text-gray-900">
                {new Date(project.createdAt).toLocaleDateString()}
              </td>
              <td className=" py-2 whitespace-nowrap">
                <button className="px-2 py-1 text-sm bg-blue-500 text-white rounded mr-2 hover:bg-blue-600 hover:cursor-pointer">
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer">
                  <i className="bi bi-trash3-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
