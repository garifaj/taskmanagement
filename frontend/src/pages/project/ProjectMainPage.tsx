import { useState } from "react";
import InviteUserModal from "./InviteUserModal";
import { useParams } from "react-router-dom";
import { useProjectRole } from "../../hooks/useProjectRole";

const ProjectMainPage = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { projectId } = useParams();
  const { role, loading } = useProjectRole(projectId);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Project Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {!loading && role === "admin" && (
          <button
            type="button"
            className="inline-block rounded-md border border-blue-500 bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600"
            onClick={() => setShowInviteModal(true)}
          >
            Invite User
          </button>
        )}
      </div>

      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        projectId={projectId}
      />
    </>
  );
};

export default ProjectMainPage;
