import { useEffect, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import ColumnItem from "./ColumnItem";
import AddColumnForm from "./AddColumnForm";

import type { Column } from "../../context/types";
import { useBoard } from "../../hooks/useBoard";

const Column = ({ projectId }: { projectId: string | undefined }) => {
  const { columns, fetchColumns, moveTask, addColumn } = useBoard();
  const [showInput, setShowInput] = useState(false);
  const [columnName, setColumnName] = useState("");

  useEffect(() => {
    if (projectId) fetchColumns(projectId);
  }, [projectId, fetchColumns]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    await moveTask(Number(active.id), Number(over.id));
  };

  const handleAddColumn = async () => {
    if (projectId && columnName.trim()) {
      await addColumn(projectId, columnName);
      setColumnName("");
      setShowInput(false);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-row gap-4 p-4 min-h-100">
        {columns.map((col: Column) => (
          <ColumnItem key={col.id} column={col} />
        ))}
        <AddColumnForm
          showInput={showInput}
          columnName={columnName}
          onAdd={handleAddColumn}
          onCancel={() => {
            setShowInput(false);
            setColumnName("");
          }}
          onNameChange={setColumnName}
          onShowForm={() => setShowInput(true)}
        />
      </div>
    </DndContext>
  );
};

export default Column;
