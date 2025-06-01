type AddColumnFormProps = {
  showInput: boolean;
  columnName: string;
  onAdd: () => void;
  onCancel: () => void;
  onNameChange: (name: string) => void;
  onShowForm: () => void;
};

const AddColumnForm = ({
  showInput,
  columnName,
  onAdd,
  onCancel,
  onNameChange,
  onShowForm,
}: AddColumnFormProps) => (
  <div className="w-1/4 flex-shrink-0">
    {showInput ? (
      <div className="bg-white p-4 rounded-lg shadow flex flex-col gap-2">
        <input
          value={columnName}
          onChange={(e) => onNameChange(e.target.value)}
          className="border border-gray-300 p-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Column name"
          autoFocus
        />
        <div className="flex gap-2 self-end">
          <button
            onClick={onAdd}
            className="bg-green-300 border border-gray-300 rounded px-2 hover:bg-green-200"
          >
            ✓
          </button>
          <button
            onClick={onCancel}
            className="bg-red-300 border border-gray-300 rounded px-2 py-1/2 hover:bg-red-200"
          >
            ✕
          </button>
        </div>
      </div>
    ) : (
      <button
        onClick={onShowForm}
        className="border border-gray-300 rounded p-2 self-start h-fit hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    )}
  </div>
);
export default AddColumnForm;
