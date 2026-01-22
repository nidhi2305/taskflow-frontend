import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { FaCheckCircle, FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import Spinner from "../components/Spinner";

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = location.state?.page;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch single task
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch task");

        const data = await res.json();
        setTask(data);
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Overdue logic
  const isOverdue = (task) => {
    if (task.status === "done") return false;
    if (!task.dueDate) return false;

    const today = new Date();
    const due = new Date(task.dueDate);

    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    return due < today;
  };

  // Back navigation (pagination safe)
  const handleBack = () => {
    navigate(`/tasks?page=${page || 1}`);
  };

  // Mark complete
  const handleMarkComplete = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "done" }),
      });

      if (!res.ok) throw new Error("Failed to mark complete");

      const updated = await res.json();
      setTask(updated);
    } catch (error) {
      console.error("Error marking complete:", error);
    }
  };

  // Delete task
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete task");

      navigate("/tasks");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (loading) {
    return(
      <div className="flex items-center justify-center top-100 min-h-screen">
        <Spinner />
      </div>
    )
  }

  if (!task) {
    return <div className="p-10 text-center text-red-500">Task not found</div>;
  }

  return (
  <>
  <div className="min-h-screen bg-indigo-100 pt-14 px-4">
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 bg-white shadow shadow-indigo-200 rounded-full text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition font-medium"
        >
          <FaArrowLeft />
          Back to Tasks
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Task Details
        </h1>
      </div>

      {/* TITLE + STATUS */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900 leading-snug break-words">
            {task.title}
          </h2>

          {/* Created Date */}
          <p className="mt-2 text-sm text-gray-500">
            Created on{" "}
            <span className="font-medium text-gray-600">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>

      {/* DESCRIPTION CARD */}
      <div className="bg-gray-50 rounded-xl p-5 mb-8 border">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Description
        </h3>

        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
          {task.description || "No description provided."}
        </p>
      </div>

      {/* META INFO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

        {/* PRIORITY */}
        <div className="bg-indigo-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1">Priority</p>
          <p className="text-lg font-semibold capitalize text-indigo-700">
            {task.priority}
          </p>
        </div>

        {/* DUE DATE */}
        <div className="bg-indigo-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1">Due Date</p>
          <p
            className={`text-lg font-semibold ${
              isOverdue(task) ? "text-orange-600" : "text-gray-800"
            }`}
          >
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "Not set"}
          </p>
        </div>

        {/* STATUS QUICK VIEW */}
        <div className="bg-indigo-50 rounded-xl p-4">
          <p className="text-sm text-gray-500 mb-1">Current Status</p>
          <p className="text-lg font-semibold text-gray-800 capitalize">
            {task.status === "todo"
              ? "Todo"
              : task.status === "in-progress"
              ? "In Progress"
              : "Done"}
          </p>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="flex flex-wrap justify-end gap-3 pt-6 border-t">

        <button
          onClick={handleMarkComplete}
          disabled={task.status === "done"}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            task.status === "done"
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          <FaCheckCircle />
          {task.status === "done" ? "Completed" : "Complete"}
        </button>

        <Link
          to={`/tasks/${task._id}/edit`}
          state={{ from: "details" }}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
        >
          <FaEdit /> Edit
        </Link>

        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          <FaTrash /> Delete
        </button>

      </div>
    </div>
  </div>
</>
);

}
