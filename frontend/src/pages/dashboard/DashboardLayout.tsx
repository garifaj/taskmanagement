import { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar Section */}
      {isSidebarOpen && (
        <div className="w-[300px] bg-white h-full overflow-y-auto shadow-md">
          <Sidebar toggleSidebar={toggleSidebar} />
        </div>
      )}

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Toggle Icon */}
        {!isSidebarOpen && (
          <span
            className="absolute text-gray-700 text-4xl top-5 left-4 cursor-pointer z-50"
            onClick={toggleSidebar}
          >
            <i className="bi bi-filter-left px-2 bg-white border rounded-md"></i>
          </span>
        )}

        {/* Scrollable Main Content */}
        <div className="overflow-y-auto p-4 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default DashboardLayout;
