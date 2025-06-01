import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API_BASE_URL from "../../utils/config";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | undefined; // assuming invitation is tied to a project
}

const InviteUserModal = ({
  isOpen,
  onClose,
  projectId,
}: InviteUserModalProps) => {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("member");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const inviteData = {
      email,
      role,
      projectId, // include if your API expects it
    };

    await axios
      .post(`${API_BASE_URL}/projectusers/invite`, inviteData, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Invitation sent successfully!");
        setEmail("");
        setRole("member");
        onClose();
      })
      .catch((error) => {
        console.error("Error sending invitation:", error);
        toast.error("Failed to send invite. Please try again.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Invite User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              type="email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteUserModal;
