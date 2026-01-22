import { useState,useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const isValidEmail = (value) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const validate = () => {
    let newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
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

      // Mark fields touched
      setTouched({
        email: true,
        password: true,
      });

      const validationErrors = validate();

      if (Object.keys(validationErrors).length > 0) {
        return;
      }

      try {
        // Call backend login API
        const data = await loginUser({
          email,
          password,
        });

        // Save user + token in context
        login(data.user, data.token);

        toast.success("Login successful");

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        const message =
          error.response?.data?.message || "Login failed";
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
          Smart task & productivity manager
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
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

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium transition duration-200"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  </>
  );
};

export default Login;
