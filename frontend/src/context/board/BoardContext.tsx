import { createContext } from "react";
import type { Column } from "../../context/types";

export type BoardContextType = {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  fetchColumns: (projectId: string) => Promise<void>;
  moveTask: (taskId: number, newColumnId: number) => Promise<void>;
  updateColumnName: (id: number, name: string) => Promise<void>;
  deleteColumn: (id: number) => Promise<void>;
  addColumn: (projectId: string, name: string) => Promise<void>;
  updateTaskName: (taskId: number, newTitle: string) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
};

const BoardContext = createContext<BoardContextType | null>(null);
export default BoardContext;
