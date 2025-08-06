import { useEffect, useState, useMemo, useContext } from "react";
import { Attachment, Subtask, Task, User } from "../../context/types";
import AttachmentCard from "./AttachmentCard";
import axios from "axios";
import API_BASE_URL from "../../utils/config";
import { useParams } from "react-router-dom";
import TaskDetailsPanel from "./TaskDetailsPanel";
import { UserContext } from "../../context/user/UserContext";
import SubtaskTable from "./SubtaskTable";
import { useProjectRole } from "../../hooks/useProjectRole";

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
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>("");
  const [showInput, setShowInput] = useState<boolean>(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const { user } = useContext(UserContext);
  const { projectId } = useParams();
  const { role } = useProjectRole(projectId);
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

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/subtasks`, {
        title: newSubtaskTitle,
        taskId: task.id,
      });
      const createdSubtask = response.data;
      setSubtasks((prev) => [...prev, createdSubtask]);
      setNewSubtaskTitle("");
      setShowInput(false);
    } catch (error) {
      console.error("Failed to create subtask:", error);
    }
  };
  const handleRemoveSubtask = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/subtasks/${id}`);
      setSubtasks((prev) => prev.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error("Failed to delete subtask:", error);
      alert("Something went wrong while deleting the subtask.");
    }
  };

  const handleToggleSubtaskStatus = async (subtask: Subtask) => {
    const updatedSubtask = {
      ...subtask,
      isCompleted: !subtask.isCompleted,
      completedBy: !subtask.isCompleted
        ? `${user?.name} ${user?.surname}`
        : null, // replace with logged-in user if available
      completedAt: !subtask.isCompleted ? new Date().toISOString() : null,
    };

    try {
      await axios.put(`${API_BASE_URL}/subtasks/${subtask.id}`, updatedSubtask);
      setSubtasks((prev) =>
        prev.map((s) => (s.id === subtask.id ? { ...s, ...updatedSubtask } : s))
      );
    } catch (error) {
      console.error("Error updating subtask:", error);
      alert("Failed to update subtask status.");
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
              {role === "admin" && (
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
              )}
            </div>
            <div className="mb-5">
              <p className="font-semibold mb-2">Description</p>
              <p className="text-gray-700 text-sm">{task.description}</p>
            </div>
            <div className="mb-5 mt-5">
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

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">Subtasks</p>
                <button
                  onClick={() => setShowInput(true)}
                  className="rounded border border-blue-500 bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-transparent hover:text-blue-600 hover:cursor-pointer"
                >
                  Add subtask
                </button>
              </div>
              {showInput && (
                <div className="mb-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Subtask title"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 rounded border px-2 py-1 text-sm"
                  />
                  <button
                    onClick={handleAddSubtask}
                    className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setShowInput(false);
                      setNewSubtaskTitle("");
                    }}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <SubtaskTable
                subtasks={subtasks}
                handleToggleSubtaskStatus={handleToggleSubtaskStatus}
                handleRemoveSubtask={handleRemoveSubtask}
              />
            </div>
          </div>
          <TaskDetailsPanel task={task} assignees={displayedAssignees} />
        </div>
      </div>
    </div>
  );
};
export default TaskDetailsModal;
