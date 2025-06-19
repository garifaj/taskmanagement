import { useEffect, useState, useMemo } from "react";
import { Attachment, Task, User } from "../../context/types";
import AttachmentCard from "./AttachmentCard";
import axios from "axios";
import API_BASE_URL from "../../utils/config";
import { useParams } from "react-router-dom";

type Props = {
  task: Task;
  onClose: () => void;
};

const TaskDetailsModal = ({ task, onClose }: Props) => {
  const [attachments, setAttachments] = useState<Attachment[]>(
    task.attachments || []
  );
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]); // All users in the project
  const [assignedUserIds, setAssignedUserIds] = useState<number[]>(
    task.taskAssignees?.map((assignment) => assignment.userId) || []
  );
  const { projectId } = useParams();

  // This will re-calculate only when assignedUserIds or users change.
  const displayedAssignees = useMemo(() => {
    return users.filter((user) => assignedUserIds.includes(user.id));
  }, [assignedUserIds, users]);

  const handleToggleUser = async (userId: number) => {
    const isAssigned = assignedUserIds.includes(userId);
    const updatedUserIds = isAssigned
      ? assignedUserIds.filter((id) => id !== userId) // Unassign
      : [...assignedUserIds, userId]; // Assign
    setAssignedUserIds(updatedUserIds);
    try {
      await axios.post(`${API_BASE_URL}/taskassignee/update-assignees`, {
        taskId: task.id,
        userIds: updatedUserIds,
      });
    } catch (error) {
      console.error("Failed to update assignees:", error);
      setAssignedUserIds(assignedUserIds);
    }
  };

  useEffect(() => {
    const fetchProjectUsers = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/projects/${projectId}`);
        setUsers(res.data.users || []);
      } catch (error) {
        console.error("Failed to fetch project users:", error);
      }
    };

    if (projectId) {
      fetchProjectUsers();
    }
  }, [projectId]); // Dependencies: projectId and task.taskAssignees

  const toggleDropdown = () => setAssignDropdownOpen((prev) => !prev);

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

  const renderAssignees = (assignees: User[]) => {
    if (!assignees || assignees.length === 0) {
      return <span>No assignees</span>;
    }
    return assignees.map((user) => `${user.name} ${user.surname}`).join(", ");
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
                  <i className="bi bi-cloud-arrow-up"></i>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="File"
                  className="sr-only"
                />
              </label>
              <div className="relative inline-block text-left">
                <button
                  type="button"
                  onClick={toggleDropdown}
                  className="px-3 py-3 text-xs text-gray-600 border border-gray-300 shadow-sm rounded-md hover:bg-gray-50"
                >
                  Assign user
                </button>
                {assignDropdownOpen && (
                  <div className="absolute z-10 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg p-4">
                    <div className="flex flex-col items-start gap-3">
                      {users.map((user) => (
                        <label
                          key={user.id}
                          className="inline-flex items-center gap-3"
                        >
                          <input
                            type="checkbox"
                            id={`user-${user.id}`}
                            className="size-4 rounded border-gray-300 shadow-sm"
                            checked={assignedUserIds.includes(user.id)}
                            onChange={() => handleToggleUser(user.id)}
                          />
                          <span className="text-sm text-gray-600">
                            {user.name} {user.surname}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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
                      key={attachment.id || index}
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
                    {renderAssignees(displayedAssignees)}
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
                      : "No due date"}
                  </dd>
                </div>
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
        </div>
      </div>
    </div>
  );
};
export default TaskDetailsModal;
