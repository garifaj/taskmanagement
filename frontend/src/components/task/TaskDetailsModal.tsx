import { useState } from "react";
import { Attachment, Task } from "../../context/types";
import AttachmentCard from "./AttachmentCard";
import axios from "axios";
import API_BASE_URL from "../../utils/config";

type Props = {
  task: Task;
  onClose: () => void;
};

const TaskDetailsModal = ({ task, onClose }: Props) => {
  const [attachments, setAttachments] = useState<Attachment[]>(
    task.attachments || []
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("taskId", task.id.toString());
    try {
      const res = await axios.post(
        "http://localhost:5070/api/attachment/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAttachments((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDeleteAttachment = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/attachment/${id}`);
      setAttachments((prev) => prev.filter((att) => att.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-100">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-[85%] relative h-[90vh] overflow-y-auto">
        <div className="mb-2">
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="h-full rounded lg:col-span-2 p-3">
            <h2 className="text-2xl font-semibold mb-4">{task.title}</h2>
            <div className="inline-flex gap-2 mb-5">
              <label className="rounded border border-gray-300 px-2 py-1 text-gray-600 shadow-sm sm:p-2 hover:bg-gray-50 hover:cursor-pointer">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs"> Upload file </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                    />
                  </svg>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="File"
                  className="sr-only"
                />
              </label>
              <button
                type="button"
                className="px-3 py-1 text-xs text-gray-600 border border-gray-300 shadow-sm rounded-md hover:bg-gray-50 hover:cursor-pointer"
              >
                Assign user
              </button>
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Description</p>
              <p className="text-gray-700 text-sm">{task.description}</p>
            </div>
            <div className="mb-2 mt-5">
              <p className="font-semibold mb-2">Attachments</p>
              {attachments.length > 0 ? (
                <div className="inline-flex gap-2 flex-wrap">
                  {attachments.map((attachment, index) => (
                    <AttachmentCard
                      key={index}
                      attachment={attachment}
                      onDelete={handleDeleteAttachment}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No attachments</p>
              )}
            </div>
          </div>
          <div className="h-full rounded p-3">
            <h3 className="text-lg font-semibold mb-3">Details</h3>
            <div className="flow-root">
              <dl className="-my-3 divide-y divide-gray-200 text-sm *:even:bg-gray-50">
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Assignee</dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    {task.taskAssignees?.map((assignee, index, array) => (
                      <span key={assignee.userId}>
                        {assignee.user.name} {assignee.user.surname}
                        {index < array.length - 1 && ", "}
                      </span>
                    ))}
                    {!task.taskAssignees?.length && <span>No assignees</span>}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Created at</dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    {task.createdAt
                      ? new Date(task.createdAt).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No creation date"}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Due date</dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No creation date"}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Priority</dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    {task.priority.toLowerCase() === "low" && (
                      <span className="inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/10 ring-inset">
                        Low
                      </span>
                    )}
                    {task.priority.toLowerCase() === "medium" && (
                      <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700 ring-1 ring-yellow-600/10 ring-inset">
                        Medium
                      </span>
                    )}
                    {task.priority.toLowerCase() === "high" && (
                      <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset">
                        High
                      </span>
                    )}
                  </dd>
                </div>
                <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">Reporter</dt>
                  <dd className="text-gray-700 sm:col-span-2">
                    {task.owner.name} {task.owner.surname}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaskDetailsModal;
