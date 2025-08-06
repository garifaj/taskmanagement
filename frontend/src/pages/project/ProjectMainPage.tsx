import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InviteUserModal from "../../components/project/InviteUserModal";
import { useProjectRole } from "../../hooks/useProjectRole";
import axios from "axios";
import API_BASE_URL from "../../utils/config";
import { Project } from "../../context/types";

import Column from "../../components/column/Column";
import ProjectUsersTable from "../../components/project/ProjectUsersTable";
import ProjectAdminDashboard from "../../components/project/ProjectAdminDashboard";

const ProjectMainPage = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<"board" | "users" | "dashboard">(
    "board"
  );

  const { projectId } = useParams();
  const { role, loading } = useProjectRole(projectId);

  const fetchProject = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects/${projectId}`);
      setProject(res.data);
    } catch (error) {
      console.error("Failed to fetch project", error);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId, fetchProject]);

  useEffect(() => {
    if (!loading) {
      if (role === "admin") {
        setActiveTab("dashboard");
      } else {
        setActiveTab("board");
      }
    }
  }, [loading, role]);

  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-700">
            {project ? project.title : "Project Dashboard"}
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

      <div className="mt-4 border-b border-gray-200 ">
        <div className="flex space-x-4 pt-2">
          {!loading && role === "admin" && (
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`pb-2 text-sm font-medium border-b-2 hover:cursor-pointer ${
                activeTab === "dashboard"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-blue-600"
              }`}
            >
              Dashboard
            </button>
          )}

          <button
            onClick={() => setActiveTab("board")}
            className={`pb-2 text-sm font-medium border-b-2 hover:cursor-pointer ${
              activeTab === "board"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-blue-600"
            }`}
          >
            Board
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`pb-2 text-sm font-medium border-b-2 hover:cursor-pointer ${
              activeTab === "users"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-blue-600"
            }`}
          >
            Users
          </button>
        </div>
      </div>

      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        projectId={projectId}
      />
      {activeTab === "users" && project?.users && (
        <ProjectUsersTable
          users={project.users}
          refreshUserTable={fetchProject}
        />
      )}
      {activeTab === "board" && (
        <div className="mt-4">
          <Column projectId={projectId} />
        </div>
      )}
      {activeTab === "dashboard" && role === "admin" && (
        <div className="mt-4">
          <ProjectAdminDashboard project={project} />
        </div>
      )}
    </>
  );
};

export default ProjectMainPage;
