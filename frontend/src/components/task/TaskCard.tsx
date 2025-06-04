import { useState } from "react";
import { Task } from "../../context/types";
import { useDraggable } from "@dnd-kit/core";
import axios from "axios";
import API_BASE_URL from "../../utils/config";
import TaskCardMenu from "./TaskCardMenu";

type TaskCardProps = {
  task: Task;
  onTaskDeleted?: (taskId: number) => void;
};

const TaskCard = ({ task, onTaskDeleted }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const saveEdit = async () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      try {
        await axios.put(
          `${API_BASE_URL}/task/${task.id}`,
          {
            title: editedTitle,
            columnId: task.columnId,
          },
          { withCredentials: true }
        );
        task.title = editedTitle;
      } catch (err) {
        console.error("Failed to update task:", err);
      }
    }
    setIsEditing(false);
  };

  const deleteTask = async () => {
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
    <div
      ref={setNodeRef}
      style={style}
      {...(!isEditing ? attributes : {})}
      {...(!isEditing ? listeners : {})}
      className={`bg-white p-3 rounded shadow mb-2 cursor-pointer hover:shadow-md relative overflow-visible ${
        isMenuOpen ? "z-50" : "z-5"
      }`}
    >
      {isEditing ? (
        <input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") saveEdit();
            if (e.key === "Escape") {
              setEditedTitle(task.title);
              setIsEditing(false);
            }
          }}
          onBlur={saveEdit}
          autoFocus
          className="w-full text-sm text-gray-700 border-b border-blue-300 focus:outline-none"
        />
      ) : (
        <p className="text-sm text-gray-700">{task.title}</p>
      )}

      <div className="absolute top-2 right-2 overflow-visible">
        <TaskCardMenu
          isActive={isMenuOpen}
          onToggle={() => setIsMenuOpen((prev) => !prev)}
          onEdit={() => {
            setIsEditing(true);
            setIsMenuOpen(false);
          }}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
};

export default TaskCard;
