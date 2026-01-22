import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEdit, FaTrash, FaSearch,FaTimes} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

const statusColors = {
  todo: "bg-blue-200 text-blue-800",
  "in-progress": "bg-yellow-200 text-yellow-800",
  done: "bg-green-200 text-green-800",
  overdue: "bg-orange-300 text-orange-800",   
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);

  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filter, setFilter] = useState(searchParams.get("status") || "All");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


  const tasksPerPage = 9;
  const navigate = useNavigate();
  // FETCH TASKS FROM BACKEND
  
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        search: search,
        page: currentPage,
        limit: tasksPerPage,
      });

      if (filter === "Completed") {
        params.append("status", "done");
      }

      if (filter === "Pending") {
        params.append("status", "pending");   
      }

      if (filter === "Overdue") {
        params.append("status", "overdue");   
      }

      const res = await fetch(`http://localhost:5000/api/tasks?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch tasks");

      const data = await res.json();

      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotalTasks(data.totalTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on page load
  useEffect(() => {
    fetchTasks();
  }, [filter, search, currentPage]);

  useEffect(() => {
    const params = {};

    if (search) params.search = search;
    if (filter && filter !== "All") params.status = filter;
    if (currentPage > 1) params.page = currentPage;

    setSearchParams(params);
  }, [search, filter, currentPage]);

  // DELETE TASK
  const handleDeleteTask = (taskId) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-800">
          Are you sure you want to delete this task?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              toast.dismiss(t.id);

              try {
                const token = localStorage.getItem("token");

                const res = await fetch(
                  `http://localhost:5000/api/tasks/${taskId}`,
                  {
                    method: "DELETE",
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );

                if (!res.ok) throw new Error("Failed to delete task");

                // Remove from UI
                setTasks((prevTasks) =>
                  prevTasks.filter((task) => task._id !== taskId)
                );

                setTotalTasks((prev) => Math.max(prev - 1, 0));

                // Success toast
                toast.success("Task deleted successfully");

              } catch (error) {
                console.error("Error deleting task:", error);
                toast.error("Failed to delete task");
              }
            }}
            className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };


  const handleMarkComplete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "done" }),
      });

      if (!res.ok) throw new Error("Failed to mark complete");

      const updatedTask = await res.json();

      // Update UI instantly
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error marking complete:", error);
      alert("Failed to mark task complete");
    }
  };

  //Overdue
  const isOverdue = (task) => {
  if (task.status === "done") return false;

  if (!task.dueDate) return false;

  const today = new Date();
  const due = new Date(task.dueDate);

  // remove time part for accurate comparison
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due < today;
};


  return (
  <>
    <div className="p-6 bg-indigo-100 min-h-screen">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-600">Manage and track your work</p>
        </div>

        {/* RIGHT SIDE: SEARCH + CREATE */}
        <div className="flex gap-3 w-full sm:w-auto">

          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);   // reset page when searching
              }}
              className="w-full pl-10 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {/* Left search icon */}
            <span className="absolute left-3 top-3 text-gray-400">
              <FaSearch />
            </span>

            {/* Right clear icon */}
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-500 transition"
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>


          {/* CREATE BUTTON */}
          <Link
            to="/tasks/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition whitespace-nowrap"
          >
            + Create Task
          </Link>
        </div>
      </div>


      {/* FILTER BAR */}
      <div className="flex space-x-3 mb-6">
        {["All", "Pending", "Completed", "Overdue"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-full font-medium transition ${
              filter === status
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-700 shadow"
            }`}
            onClick={() => {
              setFilter(status);
              setCurrentPage(1);
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {/* TASKS GRID */}
      {!loading && tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}   
              className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
            >
              <div 
                onClick={() =>
                  navigate(`/tasks/${task._id}`, {
                    state: { from: "tasks", page: currentPage },
                  })
                }
                className="cursor-pointer"
              >

                <div className="flex items-center justify-between gap-3 mb-2">
                  {/* TITLE */}
                  <h2
                    className="font-bold text-lg truncate max-w-[75%]"
                    title={task.title}
                  >
                    {task.title}
                  </h2>

                  {/* STATUS BADGE */}
                  <span
                    className={`px-2 py-1 text-sm rounded-full whitespace-nowrap flex-shrink-0 ${
                      isOverdue(task)
                        ? statusColors.overdue
                        : statusColors[task.status]
                    }`}
                  >
                    {isOverdue(task)
                      ? "Overdue"
                      : task.status === "todo"
                      ? "Todo"
                      : task.status === "in-progress"
                      ? "In Progress"
                      : "Done"}
                  </span>

                </div>

                <p
                  className="text-gray-700 mb-3 overflow-hidden text-ellipsis"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={task.description}
                >
                  {task.description}
                </p>

                <div className="flex flex-col gap-1 text-sm text-gray-500">
                  <p>
                    Created: {formatDate(task.createdAt)}
                  </p>

                  <p
                    className={`${
                      isOverdue(task) ? "text-orange-600 font-semibold" : "text-gray-500"
                    }`}
                  >
                    Due: {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>

              {/* ACTION BUTTONS (we connect later) */}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={(e) =>{
                      e.stopPropagation();
                      handleMarkComplete(task._id)
                    }
                  } 
                  disabled={task.status === "done"}
                  className={`flex items-center gap-1 px-3 py-1 rounded transition ${
                    task.status === "done"
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  <FaCheckCircle />
                  {task.status === "done" ? "Completed" : "Complete"}
                </button>

                <button
                  onClick={(e) => {  
                      e.stopPropagation();
                      navigate(`/tasks/${task._id}/edit`, {
                        state: { from: "tasks" },
                      })
                    }
                  }
                  className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                >
                  <FaEdit />
                  Edit
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTask(task._id);
                  }}

                  className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
          !loading && (
            <div className="flex flex-col items-center justify-center mt-24 text-center">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-md">
                <FaCheckCircle className="text-indigo-500 text-4xl" />
              </div>

              {totalTasks === 0 ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No tasks yet
                  </h2>
                  <p className="text-gray-500 max-w-sm">
                    Start by creating your first task to organize your work.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No matching tasks
                  </h2>
                  <p className="text-gray-500 max-w-sm">
                    Try changing filters or search keywords to find your tasks.
                  </p>
                </>
              )}
            </div>
          )
      )}

      {/* PAGINATION */}
      {tasks.length > 0 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-white shadow rounded hover:bg-gray-100 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-3 py-1 bg-white shadow rounded hover:bg-gray-100 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  </>
  );
}
