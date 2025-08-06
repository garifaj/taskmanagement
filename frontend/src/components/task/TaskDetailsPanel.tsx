import { Task, User } from "../../context/types";

// TaskDetailsSection.tsx
type Props = {
  task: Task;
  assignees: User[];
};

const TaskDetailsPanel = ({ task, assignees }: Props) => {
  const renderAssignees = (assignees: User[]) => {
    if (!assignees.length) return <span>No assignees</span>;
    return assignees.map((u) => `${u.name} ${u.surname}`).join(", ");
  };

  return (
    <div className="h-full rounded p-3">
      <h3 className="text-lg font-semibold mb-3">Details</h3>
      <div className="flow-root">
        <dl className="-my-3 divide-y divide-gray-200 text-sm *:even:bg-gray-50">
          {/* Assignee */}
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Assignee</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {renderAssignees(assignees)}
            </dd>
          </div>
          {/* Created at */}
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Created at</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {task.createdAt
                ? new Date(task.createdAt).toLocaleDateString()
                : "No creation date"}
            </dd>
          </div>
          {/* Due date */}
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Due date</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </dd>
          </div>
          {/* Priority */}
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Priority</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {task.priority?.toLowerCase() === "low" && (
                <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/10 ring-inset">
                  Low
                </span>
              )}
              {task.priority?.toLowerCase() === "medium" && (
                <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/10 ring-inset">
                  Medium
                </span>
              )}
              {task.priority?.toLowerCase() === "high" && (
                <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                  High
                </span>
              )}
            </dd>
          </div>
          <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-gray-900">Reporter</dt>
            <dd className="text-gray-700 sm:col-span-2">
              {task.owner?.name} {task.owner?.surname || "Unknown"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;
