type TaskCardMenuProps = {
  isActive: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const TaskCardMenu = ({
  onDelete,
  onToggle,
  onEdit,
  isActive,
}: TaskCardMenuProps) => {
  return (
    <div className="relative z-10" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={onToggle}
        className="p-0 rounded hover:bg-gray-200"
        aria-label="Column menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M12 6h.01M12 12h.01M12 18h.01"
          />
        </svg>
      </button>
      {isActive && (
        <div className="absolute right-0 mt-1 w-40 bg-white rounded shadow z-[999]">
          <button
            onPointerDown={(e) => {
              e.stopPropagation(); // Prevent drag start on pointer down
            }}
            onClick={onEdit}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onPointerDown={(e) => {
              e.stopPropagation(); // Prevent drag start on pointer down
            }}
            onClick={onDelete}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskCardMenu;
