import { toast } from "react-toastify";
import { Project } from "../../context/types";
import { useProjectContext } from "../../hooks/useProjectContext";
import { useEffect } from "react";

type ProjectsTableProps = {
  setShowModal: (value: boolean) => void;
  setSelectedProject: (project: Project | null) => void;
};
const ProjectsTable = ({
  setShowModal,
  setSelectedProject,
}: ProjectsTableProps) => {
  const { userProjects, fetchUserProjects, deleteProject } =
    useProjectContext();

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id); // Call the delete function from context
      toast.info("Project deleted successfully");
    }
  };

  useEffect(() => {
    fetchUserProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {userProjects.map((project: Project) => (
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
              <td className="py-2 whitespace-nowrap">
                <button
                  onClick={() => {
                    setSelectedProject(project);
                    setShowModal(true);
                  }}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded mr-2 hover:bg-blue-600 hover:cursor-pointer"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  onClick={() => handleDelete(project.id)} // Trigger delete on click
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer"
                >
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
