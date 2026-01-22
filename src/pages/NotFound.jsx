import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
  <>
    <div className="min-h-screen flex flex-col items-center justify-center bg-indigo-100 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md text-center">
        <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-gray-600 mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Go Back
        </button>
      </div>
    </div>
  </>
  );
};

export default NotFound;
