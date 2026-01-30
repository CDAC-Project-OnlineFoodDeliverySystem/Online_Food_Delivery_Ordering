import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return isLoggedIn ? (
    children
  ) : (
    <Navigate to="/signin" state={{ from: location.pathname }} replace />
  );
};

export default ProtectedRoute;
