import axios from "axios";
import TaskCardMenu from "./TaskCardMenu";
import API_BASE_URL from "../../utils/config";
import { useState } from "react";
import { Task } from "../../context/types";

type TaskCardProps = {
  task: Task;
  onTaskDeleted?: (taskId: number) => void;
};

const TaskCard = ({ task, onTaskDeleted }: TaskCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const handleToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const handleEdit = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/task/${task.id}`,
        {
          title: editedTitle,
          columnId: task.columnId, // Use existing columnId if not provided
        },
        { withCredentials: true }
      );
      task.title = editedTitle;
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/task/${task.id}`, {
        withCredentials: true,
      });
      onTaskDeleted?.(task.id);
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <div className="bg-white p-3 rounded shadow mb-2 cursor-pointer hover:shadow-md relative">
      {isEditing ? (
        <input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleEditSave();
            if (e.key === "Escape") handleCancel();
          }}
          onBlur={handleEditSave}
          autoFocus
          className="w-full text-sm text-gray-700 border-b border-blue-300 focus:outline-none"
        />
      ) : (
        <p className="text-sm text-gray-700">{task.title}</p>
      )}

      <div className="absolute top-2 right-2">
        <TaskCardMenu
          isActive={isMenuOpen}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default TaskCard;
