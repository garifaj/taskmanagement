import { Column } from "../../context/types";
import ColumnMenu from "./ColumnMenu";

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
}: ColumnItemProps) => (
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

    <div className="bg-white p-3 rounded shadow mb-2 cursor-pointer hover:shadow-md">
      <p className="text-sm text-gray-700">+ Create</p>
    </div>
  </div>
);
export default ColumnItem;
