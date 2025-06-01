import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../utils/config";
import { Task } from "../../context/types";

const CreateTaskModal = ({
  isOpen,
  onClose,
  columnId,
  onTaskCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  columnId: number;
  onTaskCreated: (task: Task) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/task`,
        {
          title,
          columnId,
          description,
          dueDate,
          priority,
        },
        {
          withCredentials: true, // ✅ this tells the browser to send cookies
        }
      );

      onTaskCreated(res.data); // ✅ Send the new task to parent
      setTitle(""); // Reset form fields
      setDescription("");
      setDueDate("");
      setPriority("Low");
      onClose(); // ✅ Close modal
    } catch (err) {
      console.error("Task creation failed", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label className="block text-sm font-medium text-gray-700">
            Due date
          </label>
          <input
            type="date"
            className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <label className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            className="p-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
