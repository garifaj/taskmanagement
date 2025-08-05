import { Project } from "../../context/types";
import { VictoryPie, VictoryTheme, VictoryBar, VictoryChart } from "victory";

type ProjectAdminDashboardProps = {
  project: Project | null;
};

const ProjectAdminDashboard = ({ project }: ProjectAdminDashboardProps) => {
  if (!project) return <div>Loading project data...</div>;

  const allTasks = project.columns.flatMap((col) => col.tasks);

  const finishedTasks = project.columns
    .filter((col) => col.name.toLowerCase() === "done")
    .flatMap((col) => col.tasks).length;

  const totalTasks = allTasks.length;
  const unfinishedTasks = totalTasks - finishedTasks;
  const totalUsers = project.users.length;

  // Pie chart data
  const pieData = [
    { x: "Uncompleted", y: unfinishedTasks },
    { x: "Completed", y: finishedTasks },
  ];

  // Priority counts for bar chart
  const priorityCounts = {
    High: allTasks.filter(
      (task) => task.priority?.trim().toLowerCase() === "high"
    ).length,
    Medium: allTasks.filter(
      (task) => task.priority?.trim().toLowerCase() === "medium"
    ).length,
    Low: allTasks.filter(
      (task) => task.priority?.trim().toLowerCase() === "low"
    ).length,
  };
  console.log("All tasks:", allTasks);

  const barData = [
    { priority: "High", count: priorityCounts.High },
    { priority: "Medium", count: priorityCounts.Medium },
    { priority: "Low", count: priorityCounts.Low },
  ];

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-md font-semibold text-gray-600">Total Tasks</h2>
          <p className="text-2xl font-semibold">{totalTasks}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-md font-semibold text-gray-600">
            Unfinished Tasks
          </h2>
          <p className="text-2xl font-semibold">{unfinishedTasks}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-md font-semibold text-gray-600">
            Completed Tasks
          </h2>
          <p className="text-2xl font-semibold">{finishedTasks}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-md font-semibold text-gray-600">Total Users</h2>
          <p className="text-2xl font-semibold">{totalUsers}</p>
        </div>
      </div>

      {/* Pie + Bar Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-md font-semibold mb-2">Task Completion</h2>
          <div className="flex justify-center items-center">
            <VictoryPie
              data={pieData}
              innerRadius={50}
              colorScale={["#f87171", "#4ade80"]} // red for uncompleted, green for completed
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              theme={VictoryTheme.clean}
              style={{
                labels: { fontSize: 14, fontWeight: "500" },
              }}
            />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-xl p-4">
          <h2 className="text-md font-semibold mb-2">Task Priority</h2>
          <div className="flex justify-center items-center">
            <VictoryChart
              domainPadding={{ x: 40 }}
              theme={VictoryTheme.clean}
              scale={{ x: "linear" }} // ✅ Correct scale for categorical x-axis
            >
              <VictoryBar
                data={barData}
                x="priority"
                y="count"
                labels={({ datum }) => datum.count}
                style={{
                  data: {
                    width: 20,
                    fill: ({ datum }) => {
                      const priority = datum.priority.toLowerCase();
                      if (priority === "high") return "#ef4444"; // red-500
                      if (priority === "medium") return "#f97316"; // orange-500
                      if (priority === "low") return "#eab308"; // yellow-500
                      return "#9ca3af"; // fallback gray
                    },
                  },
                  labels: { fontSize: 12, fill: "#374151", fontWeight: 500 },
                }}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAdminDashboard;
