import React from "react";
import { User } from "../../context/types";

interface EditRoleModalProps {
  user: User;
  newRole: string;
  setNewRole: (role: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const EditUserRoleModal: React.FC<EditRoleModalProps> = ({
  user,
  newRole,
  setNewRole,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Edit Role for {user.name} {user.surname}
        </h3>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserRoleModal;
