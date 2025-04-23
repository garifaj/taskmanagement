import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/config";
import { Project } from "../../context/types";
import { useProjectContext } from "../../hooks/useProjectContext";
import NewProjectModal from "./NewProjectModal";

type SidebarProps = {
  toggleSidebar: () => void;
};

const Sidebar = ({ toggleSidebar }: SidebarProps) => {
  const { setUser } = useContext(UserContext);
  const [isDropdownOpen, setDropdownOpen] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { projects, fetchUserProjects } = useProjectContext();

  const handleLogout = async () => {
    await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
    navigate("/"); // Redirect to homepage after logging out
    setUser(null); // Clear user data from context
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="sidebar h-screen p-2 overflow-y-auto text-center bg-white shadow-md rounded-md">
        <div className="text-gray-600 text-xl">
          <div className="p-2.5 mt-1 flex items-center">
            <h1 className="font-bold text-[15px] ml-3">TaskFlow</h1>
            <i
              className="bi bi-x cursor-pointer ml-auto text-gray-500 lg:hidden"
              onClick={toggleSidebar}
            ></i>
          </div>
          <div className="my-2 bg-gray-300 h-[1px]"></div>
        </div>

        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-500/10 text-gray-500 hover:text-blue-500">
          <i className="bi bi-house-door-fill"></i>
          <span className="text-[15px] ml-4 font-medium">Dashboard</span>
        </div>

        <div
          className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-500/10 text-gray-500 hover:text-blue-500"
          onClick={toggleDropdown}
        >
          <i className="bi bi-kanban"></i>
          <div className="flex justify-between w-full items-center">
            <span className="text-[15px] ml-4 font-medium">Projects</span>
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
            <div className="text-left text-sm mt-2 w-4/5 mx-auto text-gray-500  font-medium">
              {projects.map((project: Project) => (
                <h1
                  key={project.id}
                  className="cursor-pointer p-2 hover:bg-blue-500/10 rounded-md mt-1 hover:text-blue-500"
                >
                  {project.title}
                </h1>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-2 flex items-center rounded py-1.5 px-4 text-sm font-medium text-left text-blue-600 transition-colors duration-300 hover:text-blue-400 focus:outline-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>

              <span className="mx-2">Add new project</span>
            </button>
          </>
        )}

        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gray-200 text-red-500">
          <i className="bi bi-box-arrow-in-right"></i>
          <button
            onClick={handleLogout}
            className="text-[15px] ml-4 font-medium cursor-pointer"
          >
            Sign out
          </button>
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
