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
  // Calculate completed percentage
  const completedCount = subtasks.filter((s) => s.isCompleted).length;
  const totalCount = subtasks.length;
  const progressPercent =
    totalCount === 0 ? 0 : (completedCount / totalCount) * 100;

  return (
    <div>
      {subtasks && subtasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-center text-gray-600">{`${Math.round(
            progressPercent
          )}% of subtasks completed`}</p>
          <div className="w-full bg-gray-300 rounded h-3 overflow-hidden mb-2">
            <div
              className="bg-green-500 h-3 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
              aria-label={`Progress: ${Math.round(progressPercent)}% completed`}
            ></div>
          </div>
          <div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
            <table className="min-w-full divide-y-2 divide-gray-200">
              <thead className="ltr:text-left rtl:text-right">
                <tr className="*:font-medium *:text-gray-900">
                  <th className="px-3 py-2 whitespace-nowrap">Title</th>
                  <th className="px-3 py-2 whitespace-nowrap">Status</th>
                  <th className="px-3 py-2 whitespace-nowrap">Author</th>
                  <th className="px-3 py-2 whitespace-nowrap text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subtasks.map((subtask) => (
                  <tr key={subtask.id} className="*:text-gray-900">
                    <td className="px-3 py-1 whitespace-nowrap">
                      {subtask.title}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {subtask.isCompleted ? (
                        <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/10 ring-inset">
                          Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-red-600/10 ring-inset">
                          In progress
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {subtask.completedBy || ""}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap flex items-center justify-center space-x-2">
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
