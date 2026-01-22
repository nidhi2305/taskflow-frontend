import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const isValidName = (value) => {
    return /^[A-Za-z\s]+$/.test(value);   // only letters and spaces
  };

  const isStrongPassword = (value) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
  };

  const isValidEmail = (value) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const validate = () => {
    let newErrors = {};

    // Name
    if (!name) {
      newErrors.name = "Name is required";
    } else if (!isValidName(name)) {
      newErrors.name = "Name should contain only letters";
    }

    // Email
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email";
    }

    // Password
    if (!password) {
      newErrors.password = "Password is required";
    } else if (!isStrongPassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters long and contain an uppercase, a lowercase, a number and a symbol";
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validate();
  };

      const handleSubmit = async (e) => {
      e.preventDefault();

      // Mark all fields as touched
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });

      const validationErrors = validate();

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      try {
        // Call backend register API
        const data = await registerUser({
          name,
          email,
          password,
        });

        // Auto login after register
        login(data.user, data.token);

        toast.success("Registration successful 🎉");

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        const message =
          error.response?.data?.message || "Registration failed";
        toast.error(message);
      }
    };


  return (
  <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        
        {/* App Name */}
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          TaskFlow
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="Enter your name"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                touched.name && errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-indigo-600"
              }`}
            />
            {touched.name && errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                touched.email && errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-indigo-600"
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                touched.password && errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-indigo-600"
              }`}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-600 mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Confirm your password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                touched.confirmPassword && errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-indigo-600"
              }`}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition duration-200"
          >
            Register
          </button>
        </form>

        {/* Login */}
        <p className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  </>
  );
};

export default Register;
