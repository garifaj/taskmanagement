import { Subtask } from "../../context/types";

type SubtaskTableProps = {
  subtasks: Subtask[];
  handleToggleSubtaskStatus: (subtask: Subtask) => void;
  handleRemoveSubtask: (subtaskId: number) => void;
};

const SubtaskTable = ({
  subtasks,
  handleToggleSubtaskStatus,
  handleRemoveSubtask,
}: SubtaskTableProps) => {
  return (
    <div>
      {subtasks && subtasks.length > 0 && (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
            <table className="min-w-full divide-y-2 divide-gray-200">
              <thead className="ltr:text-left rtl:text-right">
                <tr className="*:font-medium *:text-gray-900">
                  <th className="px-3 py-2 whitespace-nowrap">Title</th>
                  <th className="px-3 py-2 whitespace-nowrap">Status</th>
                  <th className="px-3 py-2 whitespace-nowrap">Author</th>
                  <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subtasks.map((subtask) => (
                  <tr key={subtask.id} className="*:text-gray-900">
                    <td className="px-3 py-1 whitespace-nowrap">
                      {subtask.title}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {subtask.isCompleted ? "Done" : "In Progress"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {subtask.completedBy || ""}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <label
                          htmlFor={`subtask-${subtask.id}`}
                          className="relative block h-6 w-12 rounded-full bg-gray-300 transition-colors has-[:checked]:bg-green-500"
                        >
                          <input
                            type="checkbox"
                            id={`subtask-${subtask.id}`}
                            className="peer sr-only"
                            checked={subtask.isCompleted}
                            onChange={() => handleToggleSubtaskStatus(subtask)}
                          />
                          <span className="absolute inset-y-0 start-0 m-1 size-4 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-6"></span>
                        </label>

                        <button
                          onClick={() => handleRemoveSubtask(subtask.id)}
                          className="bg-red-500 text-white rounded hover:bg-red-600 px-2 py-1 text-sm"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubtaskTable;
