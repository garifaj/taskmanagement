import { useEffect, useState } from "react";
import type { Column as ColumnType } from "../../context/types";
import axios from "axios";
import AddColumnForm from "./AddColumnForm";
import ColumnItem from "./ColumnItem";

type ColumnProps = {
  projectId: string | undefined;
};

const Column = ({ projectId }: ColumnProps) => {
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [editingColumnId, setEditingColumnId] = useState<number | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [columnName, setColumnName] = useState("");

  const handleEditColumn = (column: ColumnType) => {
    setEditingColumnId(column.id);
    setEditedName(column.name);
    setActiveMenu(null); // Close menu
  };

  const handleUpdateColumn = async (columnId: number) => {
    if (!editedName.trim()) return;

    try {
      await axios.put(`http://localhost:5070/api/columns/${columnId}`, {
        name: editedName,
      });
      setColumns((prev) =>
        prev.map((col) =>
          col.id === columnId ? { ...col, name: editedName } : col
        )
      );
    } catch (err) {
      console.error("Failed to update column name:", err);
    }

    setEditingColumnId(null);
    setEditedName("");
  };

  const handleCancelEdit = () => {
    setEditingColumnId(null);
    setEditedName("");
  };
  const handleDeleteColumn = (columnId: number) => {
    if (!confirm("Are you sure you want to delete this column?")) return;

    axios
      .delete(`http://localhost:5070/api/columns/${columnId}`)
      .then(() => {
        setColumns((prev) => prev.filter((col) => col.id !== columnId));
      })
      .catch((err) => console.error("Failed to delete column:", err));
    setActiveMenu(null);
  };

  useEffect(() => {
    if (!projectId) return;

    const fetchColumns = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5070/api/project/${projectId}/columns`
        );
        setColumns(response.data);
      } catch (error) {
        console.error("Failed to fetch columns:", error);
      }
    };

    fetchColumns();
  }, [projectId]);

  const handleAddColumn = async () => {
    if (!projectId || !columnName.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:5070/api/project/${projectId}/columns`,
        { name: columnName }
      );
      setColumns((prev) => [...prev, response.data]);
      setColumnName("");
      setShowInput(false);
    } catch (error) {
      console.error("Failed to add column:", error);
    }
  };

  const handleCancel = () => {
    setColumnName("");
    setShowInput(false);
  };

  return (
    <div className="flex flex-row gap-4 p-4 bg-gray-50 min-h-100">
      {columns.map((column) => (
        <ColumnItem
          key={column.id}
          column={column}
          isEditing={editingColumnId === column.id}
          editedName={editedName}
          activeMenu={activeMenu}
          onEditStart={handleEditColumn}
          onEditSave={handleUpdateColumn}
          onEditCancel={handleCancelEdit}
          onDelete={handleDeleteColumn}
          onMenuToggle={(columnId) =>
            setActiveMenu((prev) => (prev === columnId ? null : columnId))
          }
          onNameChange={setEditedName}
        />
      ))}

      <AddColumnForm
        showInput={showInput}
        columnName={columnName}
        onAdd={handleAddColumn}
        onCancel={handleCancel}
        onNameChange={setColumnName}
        onShowForm={() => setShowInput(true)}
      />
    </div>
  );
};

export default Column;
