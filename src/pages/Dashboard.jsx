import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaClock } from "react-icons/fa";
import Spinner from "../components/Spinner";
const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard stats
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/tasks/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch dashboard");

      const data = await res.json();
      setStats(data);

    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
  <>
    <div className="min-h-screen bg-indigo-100">
      <div className="w-full px-6 py-8">

        {/* WELCOME */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name} 
          </h1>
          <p className="text-gray-600 mt-2">
            Here’s your task overview
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        )}

        {/* STATS */}
        {!loading && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

              {/* TOTAL */}
              <div className="bg-indigo-200 border border-indigo-300 p-6 rounded-xl shadow-sm">
                <p className="text-sm text-indigo-800 font-medium">
                  Total Tasks
                </p>
                <h2 className="text-4xl font-bold text-indigo-900 mt-3">
                  {stats.totalTasks}
                </h2>
              </div>

              {/* PENDING */}
              <div className="bg-rose-200 border border-rose-300 p-6 rounded-xl shadow-sm">
                <p className="text-sm text-rose-800 font-medium">
                  Pending
                </p>
                <h2 className="text-4xl font-bold text-rose-900 mt-3">
                  {stats.pendingTasks}
                </h2>
              </div>

              {/* COMPLETED */}
              <div className="bg-green-200 border border-green-300 p-6 rounded-xl shadow-sm">
                <p className="text-sm text-green-800 font-medium">
                  Completed
                </p>
                <h2 className="text-4xl font-bold text-green-900 mt-3">
                  {stats.completedTasks}
                </h2>
              </div>

            </div>

            {/* RECENT TASKS SECTION */}
            {stats.recentTasks.length === 0 ? (
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl shadow-sm p-12 text-center">

                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  You don’t have any tasks yet
                </h2>

                <p className="text-gray-500 mb-6">
                  Start by creating your first task and stay organized.
                </p>

                <button
                  onClick={() => navigate("/tasks/create")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
                >
                  Create Task
                </button>
              </div>
            ) : (
              // RECENT TASKS 
              <div className="bg-indigo-200 border border-indigo-400 rounded-xl shadow-sm p-6">

                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-indigo-900">
                    Recent Tasks
                  </h2>

                  <button
                    onClick={() => navigate("/tasks")}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    View All →
                  </button>
                </div>

                <div className="space-y-4">
                  {stats.recentTasks.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => navigate(`/tasks/${task._id}`)}
                      className="flex justify-between items-center p-4 rounded-lg bg-white border border-indigo-100 hover:bg-indigo-100 cursor-pointer transition"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {task.title}
                        </h3>
                        <p
                          className={`text-sm font-medium ${
                            task.status === "done"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {task.status === "done" ? "Completed" : "Pending"}
                        </p>
                      </div>

                      {task.status === "done" ? (
                        <FaCheckCircle className="text-green-300 text-xl" />
                      ) : (
                        <FaClock className="text-yellow-300 text-xl" />
                      )}
                    </div>
                  ))}
                </div>

              </div>
            )}
          </>
        )}

      </div>
    </div>
  </>
  );
};

export default Dashboard;
