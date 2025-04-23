import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import ProjectsTable from "./ProjectsTable";
import NewProjectModal from "./NewProjectModal";
import { Slide, ToastContainer } from "react-toastify";
import { useProjectContext } from "../../hooks/useProjectContext";

const DashboardMainPage = () => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { fetchUserProjects } = useProjectContext();
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        pauseOnHover={false}
        theme="light"
        transition={Slide}
      />
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, {user?.name} {user?.surname}!
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

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">My Projects</h2>
          <button
            onClick={() => setShowModal(true)}
            className="inline-block shrink-0 rounded-md border border-blue-500 bg-blue-500 px-3 py-2 text-sm font-medium text-white transition hover:cursor-pointer hover:bg-transparent hover:text-blue-600"
          >
            + New Project
          </button>
        </div>
      </div>

      <ProjectsTable />
      <NewProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        refreshProjects={fetchUserProjects}
      />
    </>
  );
};

export default DashboardMainPage;
