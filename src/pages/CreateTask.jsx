import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CreateTask() {
  const today = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(today);
  const [status, setStatus] = useState("todo"); // default from schema
  const [priority, setPriority] = useState("medium"); // default from schema

  // inline validation errors
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Validation function
  const validate = () => {
    const newErrors = {};

    // Title required
    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    // Due date required
    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Past date not allowed
      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await api.post(
        "/tasks",
        {
          title,
          description,
          dueDate,
          status,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Task created:", res.data);
      navigate("/tasks");

    } catch (err) {
      console.error("Error creating task:", err);
    }
  };


  return (
  <>
    <div className="min-h-screen bg-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow p-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Task</h1>
          <p className="text-gray-500">Add details for your new task</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors({ ...errors, title: "" });
              }}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* STATUS + PRIORITY */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* DUE DATE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setErrors({ ...errors, dueDate: "" });
              }}
              className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.dueDate ? "border-red-500" : ""
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
  );
}