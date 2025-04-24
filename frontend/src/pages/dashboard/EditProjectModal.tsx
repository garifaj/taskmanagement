import { useEffect, useState } from "react";

import API_BASE_URL from "../../utils/config";
import { toast } from "react-toastify";
import axios from "axios";
import { EditProjectModalProps } from "../../context/types";

const EditProjectModal = ({
  isOpen,
  onClose,
  refreshProjects,
  selectedProject,
}: EditProjectModalProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    if (selectedProject) {
      setTitle(selectedProject.title);
      setDescription(selectedProject.description || "");
    }
  }, [selectedProject]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const projectData = {
      title,
      description,
    };
    await axios
      .put(`${API_BASE_URL}/projects/${selectedProject?.id}`, projectData)
      .then(() => {
        toast.success("Project edited successfully!");
        refreshProjects();
        setTitle("");
        setDescription("");
        onClose();
      })
      .catch((error: string) => {
        console.error("Error creating project:", error);
        toast.error("Failed to edit project. Please try again.");
      }); // Close the modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Edit project</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;
