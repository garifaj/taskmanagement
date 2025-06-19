import { useEffect, useState } from "react";
import { Column as ColumnType, Task } from "../../context/types";
import ColumnMenu from "./ColumnMenu";
import CreateTaskButton from "../task/CreateTaskButton";
import TaskCard from "../task/TaskCard";
import { useDroppable } from "@dnd-kit/core";
import { useBoard } from "../../hooks/useBoard";

const ColumnItem = ({ column }: { column: ColumnType }) => {
  const { updateColumnName, deleteColumn, setColumns } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(column.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const bgColor = isOver ? "bg-blue-100" : "bg-gray-100";

  const handleEditSave = async () => {
    if (editedName.trim() !== column.name) {
      await updateColumnName(column.id, editedName);
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteColumn(column.id);
  };

  const handleTaskCreated = (newTask: Task) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === column.id ? { ...col, tasks: [...col.tasks, newTask] } : col
      )
    );
  };

  useEffect(() => {
    setEditedName(column.name);
  }, [column.name]);

  return (
    <div
      ref={setNodeRef}
      className={`${bgColor} rounded-lg p-4 w-1/4 relative min-h-[200px] `}
    >
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEditSave();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className="text-xs font-semibold uppercase text-gray-700 border-b border-blue-300 focus:outline-none"
            autoFocus
          />
        ) : (
          <h2 className="text-xs font-semibold uppercase text-gray-500">
            {column.name}
          </h2>
        )}
        <ColumnMenu
          columnId={column.id}
          isActive={menuOpen}
          onToggle={() => setMenuOpen((prev) => !prev)}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
      </div>
      {(column.tasks || []).map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      <CreateTaskButton
        columnId={column.id}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
};

export default ColumnItem;
