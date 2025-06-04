import React, { useCallback, useState } from "react";
import axios from "axios";
import BoardContext from "./BoardContext";
import type { Column } from "../../context/types";
import API_BASE_URL from "../../utils/config";

export const BoardProvider = ({ children }: { children: React.ReactNode }) => {
  const [columns, setColumns] = useState<Column[]>([]);

  const fetchColumns = useCallback(async (projectId: string) => {
    const res = await axios.get(`${API_BASE_URL}/project/${projectId}/columns`);
    setColumns(res.data);
  }, []);

  const moveTask = async (taskId: number, newColumnId: number) => {
    await axios.put(`${API_BASE_URL}/task/${taskId}`, {
      columnId: newColumnId,
    });

    setColumns((prevColumns) => {
      const updated = prevColumns.map((col) => ({
        ...col,
        tasks: col.tasks.filter((task) => task.id !== taskId),
      }));

      const movedTask = prevColumns
        .flatMap((col) => col.tasks)
        .find((task) => task.id === taskId);

      if (movedTask) {
        const newColumns = updated.map((col) =>
          col.id === newColumnId
            ? {
                ...col,
                tasks: [...col.tasks, { ...movedTask, columnId: newColumnId }],
              }
            : col
        );
        return newColumns;
      }
      return prevColumns;
    });
  };

  const updateTaskName = async (taskId: number, newTitle: string) => {
    await axios.put(`${API_BASE_URL}/task/${taskId}`, { title: newTitle });
    setColumns((prev) => {
      const updated = structuredClone(prev);
      for (const col of updated) {
        const task = col.tasks.find((t) => t.id === taskId);
        if (task) {
          task.title = newTitle;
          break;
        }
      }
      return updated;
    });
  };

  const deleteTask = async (taskId: number) => {
    await axios.delete(`${API_BASE_URL}/task/${taskId}`);
    setColumns((prev) => {
      return prev.map((col) => ({
        ...col,
        tasks: col.tasks.filter((t) => t.id !== taskId),
      }));
    });
  };

  const updateColumnName = async (id: number, name: string) => {
    await axios.put(`${API_BASE_URL}/columns/${id}`, { name });
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  };

  const deleteColumn = async (id: number) => {
    await axios.delete(`${API_BASE_URL}/columns/${id}`);
    setColumns((prev) => prev.filter((c) => c.id !== id));
  };

  const addColumn = async (projectId: string, name: string) => {
    const res = await axios.post(
      `${API_BASE_URL}/project/${projectId}/columns`,
      { name }
    );
    setColumns((prev) => [...prev, res.data]);
  };

  return (
    <BoardContext.Provider
      value={{
        columns,
        setColumns,
        fetchColumns,
        moveTask,
        updateColumnName,
        deleteColumn,
        addColumn,
        updateTaskName,
        deleteTask,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};
