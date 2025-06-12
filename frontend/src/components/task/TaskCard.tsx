import { useState } from "react";
import { Task } from "../../context/types";
import { useDraggable } from "@dnd-kit/core";
import TaskCardMenu from "./TaskCardMenu";
import { useBoard } from "../../hooks/useBoard";
import TaskDetailsModal from "./TaskDetailsModal";

type TaskCardProps = {
  task: Task;
};

const TaskCard = ({ task }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { deleteTask, updateTaskName } = useBoard();

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  const saveEdit = async () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      try {
        await updateTaskName(task.id, editedTitle); // ✅ update from context
      } catch (err) {
        console.error("Failed to update task:", err);
      }
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id); // ✅ delete from context
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <>
      <div
        className={`bg-white p-3 rounded shadow mb-2 hover:shadow-md relative cursor-pointer overflow-visible ${
          isMenuOpen ? "z-50" : "z-5"
        }`}
        style={style}
        onClick={() => {
          if (!isEditing && !isMenuOpen) setShowModal(true);
        }}
      >
        <div className="flex items-start gap-2 ">
          {/* Drag handle */}
          <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="cursor-grab active:cursor-grabbing mt-1"
          >
            ⠿
          </div>

          {/* Title or Input */}
          <div className="flex-1 mt-1">
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
          </div>
        </div>

        {/* Menu */}
        <div className="absolute top-2 right-2">
          <TaskCardMenu
            isActive={isMenuOpen}
            onToggle={() => setIsMenuOpen((prev) => !prev)}
            onEdit={() => {
              setIsEditing(true);
              setIsMenuOpen(false);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <TaskDetailsModal task={task} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default TaskCard;
