import { useEffect, useState } from "react";
import { Column, Task } from "../../context/types";
import ColumnMenu from "./ColumnMenu";
import CreateTaskButton from "../task/CreateTaskButton";
import TaskCard from "../task/TaskCard";
import axios from "axios";
import API_BASE_URL from "../../utils/config";

type ColumnItemProps = {
  column: Column;
  isEditing: boolean;
  editedName: string;
  activeMenu: number | null;
  onEditStart: (column: Column) => void;
  onEditSave: (columnId: number) => void;
  onEditCancel: () => void;
  onDelete: (columnId: number) => void;
  onMenuToggle: (columnId: number) => void;
  onNameChange: (newName: string) => void;
};

const ColumnItem = ({
  column,
  isEditing,
  editedName,
  activeMenu,
  onEditStart,
  onEditSave,
  onEditCancel,
  onDelete,
  onMenuToggle,
  onNameChange,
}: ColumnItemProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/task/column/${column.id}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, [column.id]);

  const addTask = (newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <div className="bg-gray-100 rounded-lg p-4 w-1/4 relative">
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <input
            value={editedName}
            onChange={(e) => onNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEditSave(column.id);
              if (e.key === "Escape") onEditCancel();
            }}
            onBlur={() => onEditSave(column.id)}
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
          isActive={activeMenu === column.id}
          onToggle={onMenuToggle}
          onEdit={() => onEditStart(column)}
          onDelete={() => onDelete(column.id)}
        />
      </div>
      {tasks.map((task: Task) => (
        <TaskCard key={task.id} task={task} onTaskDeleted={handleDeleteTask} />
      ))}
      <CreateTaskButton columnId={column.id} onTaskCreated={addTask} />
    </div>
  );
};

export default ColumnItem;
