import { useParams } from "react-router-dom";
import API_BASE_URL from "../../utils/config";
import { User } from "../../context/types";
import axios from "axios";
import { Slide, toast, ToastContainer } from "react-toastify";
import { useContext, useState } from "react";
import { UserContext } from "../../context/user/UserContext";

import { useProjectRole } from "../../hooks/useProjectRole";
import EditUserRoleModal from "./EditUserRoleModal";

interface Props {
  users: User[];
  refreshUserTable: () => void; // new prop
}

const ProjectUsersTable: React.FC<Props> = ({ users, refreshUserTable }) => {
  const { projectId } = useParams();
  const { user: loggedInUser } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { role, loading } = useProjectRole(projectId);

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role || "User"); // default to current role or "User"
    setIsModalOpen(true);
  };

  const handleRoleUpdate = async () => {
    if (!projectId || !selectedUser) return;

    try {
      await axios.put(
        `${API_BASE_URL}/projectusers/${projectId}/update-role/${selectedUser.id}`,
        JSON.stringify(newRole),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Role updated successfully!");
      setIsModalOpen(false);
      refreshUserTable();
    } catch (error) {
      console.error("Failed to update role:", error);
      toast.error("Error updating role.");
    }
  };

  const handleRemove = async (userId: number) => {
    if (!projectId) return;
    const confirm = window.confirm(
      "Are you sure you want to remove this user?"
    );
    if (!confirm) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/projectusers/${projectId}/remove-user/${userId}`
      );
      toast.info("User removed successfully!");
      refreshUserTable(); // 👈 Call the passed prop
    } catch (error) {
      console.error("Failed to remove user:", error);
      alert("Error removing user.");
    }
  };

  return (
    <div className="mt-8">
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Project Users
      </h2>
      <div className="overflow-x-auto rounded-lg border border-gray-300">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className="text-left bg-gray-150">
            <tr className="*:font-medium *:text-gray-900">
              <th className="px-3 py-3">#</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Role</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={user.id} className="bg-white hover:bg-gray-50">
                <td className="px-3 py-2">{index + 1}</td>
                <td className="px-3 py-2 font-medium">
                  {user.name} {user.surname}
                </td>
                <td className="px-3 py-2">{user.email}</td>
                <td className="px-3 py-2 capitalize">
                  {user.role?.toLowerCase() === "admin" ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/10 ring-inset">
                      {user.role}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600/10 ring-inset">
                      {user.role}
                    </span>
                  )}
                </td>

                <td className="px-1 py-2 text-center">
                  {loggedInUser?.id !== user.id &&
                    !loading &&
                    role === "admin" && (
                      <>
                        <button
                          onClick={() => openEditModal(user)}
                          className="px-2 py-1 mx-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          onClick={() => handleRemove(user.id)}
                          className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <i className="bi bi-person-x-fill"></i>
                        </button>
                      </>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && selectedUser && (
        <EditUserRoleModal
          user={selectedUser}
          newRole={newRole}
          setNewRole={setNewRole}
          onClose={() => setIsModalOpen(false)}
          onSave={handleRoleUpdate}
        />
      )}
    </div>
  );
};

export default ProjectUsersTable;
