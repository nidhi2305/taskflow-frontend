import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";


export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");

  const [errors, setErrors] = useState({});

  const location = useLocation();
  const from = location.state?.from; // "tasks" or "details"

  // Fetch task details
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

        setTitle(data.title);
        setDescription(data.description || "");
        setStatus(data.status);
        setPriority(data.priority);
        setDueDate(data.dueDate ? data.dueDate.slice(0, 10) : "");
      } catch (err) {
        console.error(err);
      }
    };

    fetchTask();
  }, [id]);

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!dueDate) {
      newErrors.dueDate = "Due date is required";
    } else {
      const selected = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selected < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          status,
          priority,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      if (from === "details") {
        navigate(`/tasks/${id}`);   // back to task details
      } else {
        navigate("/tasks");        // back to task list
      }

    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
  <>
    <div className="min-h-screen bg-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Task</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Task Title *"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className={`w-full p-2 border rounded ${
                errors.title ? "border-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded resize-none"
          ></textarea>

          {/* Due Date */}
          <div>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                setErrors((prev) => ({ ...prev, dueDate: "" }));
              }}
              className={`w-full p-2 border rounded ${
                errors.dueDate ? "border-red-500" : ""
              }`}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
            )}
          </div>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
          </select>

          {/* Priority */}
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>{
                if (from === "details") {
                  navigate(`/tasks/${id}`);   // back to task details
                } else {
                  navigate("/tasks");        // back to task list
                } 
              }} 
              className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
  );
}
