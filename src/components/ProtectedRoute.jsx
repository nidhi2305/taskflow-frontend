import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { token, loading } = useContext(AuthContext);

  // While checking auth (page refresh case)
  if (loading) {
    return <h3>Loading...</h3>;
  }

  // If not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If logged in → render nested routes
  return <Outlet />;
};

export default ProtectedRoute;
