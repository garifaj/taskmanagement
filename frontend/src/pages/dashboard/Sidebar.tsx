import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user/UserContext";
import API_BASE_URL from "../../utils/config";
import { Project } from "../../context/types";
import { useProjectContext } from "../../hooks/useProjectContext";
import NewProjectModal from "./NewProjectModal";
import { PlusIcon } from "../../constants/icons";

type SidebarProps = {
  toggleSidebar: () => void;
};

const Sidebar = ({ toggleSidebar }: SidebarProps) => {
  const { setUser, setReady } = useContext(UserContext);
  const [isDropdownOpen, setDropdownOpen] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { userProjects, fetchUserProjects } = useProjectContext();

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      setReady(false); // Reset ready state
      navigate("/");
    } catch (error) {
      console.error("Logout request error:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    if (userProjects.length === 0) {
      fetchUserProjects(); // Re-fetch if empty (initial load or refresh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="sidebar h-screen p-4 overflow-y-auto bg-white shadow-lg rounded-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between py-3 px-2 border-b border-gray-100">
            <h1 className="font-bold text-xl text-blue-600 tracking-wide">
              TaskFlow
            </h1>
            <i
              className="bi bi-x cursor-pointer text-gray-400 hover:text-gray-600 lg:hidden text-2xl"
              onClick={toggleSidebar}
            ></i>
          </div>

          <div
            className="p-3 mt-4 flex items-center rounded-lg px-4 duration-200 cursor-pointer text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => navigate("")}
          >
            <i className="bi bi-house-door-fill text-lg"></i>
            <span className="text-base ml-4 font-medium">Dashboard</span>
          </div>

          <div
            className="p-3 mt-2 flex items-center rounded-lg px-4 duration-200 cursor-pointer text-gray-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={toggleDropdown}
          >
            <i className="bi bi-kanban text-lg"></i>
            <div className="flex justify-between w-full items-center">
              <span className="text-base ml-4 font-medium">Projects</span>
              <span
                className={`text-sm transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                <i className="bi bi-chevron-down"></i>
              </span>
            </div>
          </div>
          {isDropdownOpen && (
            <>
              <div className="text-left text-sm mt-2 pl-12 pr-4 text-gray-600 font-normal">
                {userProjects.map((project: Project) => (
                  <h1
                    key={project.id}
                    onClick={() => navigate(`projects/${project.id}`)}
                    className="cursor-pointer py-2 hover:bg-blue-50 rounded-md my-1 hover:text-blue-700 transition-colors duration-200"
                  >
                    {project.title}
                  </h1>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-3 ml-10 flex items-center rounded-full py-2 px-4 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 transition-colors duration-300 hover:bg-blue-100 hover:border-blue-200 focus:outline-none cursor-pointer"
              >
                <PlusIcon />
                <span>Add new project</span>
              </button>
            </>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4 pb-2 px-2">
          <div
            className="p-3 flex items-center rounded-lg px-4 duration-300 cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-in-right text-lg"></i>
            <span className="text-base ml-4 font-medium">Sign out</span>
          </div>
        </div>
      </div>
      <NewProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        refreshProjects={fetchUserProjects}
      />
    </>
  );
};

export default Sidebar;
