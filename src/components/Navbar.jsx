import { Link, NavLink } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profileRef = useRef();
  const mobileRef = useRef();

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/login");
};


  // Close avatar on outside click (desktop)
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="w-full px-6 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="TaskFlow Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="font-bold text-2xl">
              TaskFlow
            </span>
          </div>

          {/* Desktop Routes */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `pb-1 border-b-2 transition ${
                  isActive
                    ? "border-white font-semibold"
                    : "border-transparent hover:border-indigo-300"
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `pb-1 border-b-2 transition ${
                  isActive
                    ? "border-white font-semibold"
                    : "border-transparent hover:border-indigo-300"
                }`
              }
            >
              Tasks
            </NavLink>
          </div>
        </div>

        {/* RIGHT DESKTOP AVATAR */}
        <div className="hidden md:block relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-10 h-10 rounded-full bg-white text-indigo-600 font-bold flex items-center justify-center"
          >
            {initials}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden">

              <div className="px-4 py-4 text-center border-b">
                <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold mb-2">
                  {initials}
                </div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 hover:bg-gray-200 text-red-600"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div
          ref={mobileRef}
          className="md:hidden bg-white text-gray-800 shadow-lg px-4 py-5 space-y-4"
        >
          {/* Routes */}
          <NavLink
            to="/dashboard"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-600"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/tasks"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium transition ${
                isActive
                  ? "bg-indigo-100 text-indigo-600"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Tasks
          </NavLink>

          {/* Profile Section */}
          <div className="border-t pt-4 text-center">

            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold mb-2">
              {initials}
            </div>

            <p className="font-semibold">{user?.name}</p>
            <p className="text-sm text-gray-500 mb-4">{user?.email}</p>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2 hover:bg-gray-200 text-red-600  rounded-md"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
