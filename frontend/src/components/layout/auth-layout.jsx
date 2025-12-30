import { Navigate, Outlet, useNavigate } from "react-router";
import { useAuth } from "../../context/auth-context";

export const AuthLayout = () => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to={"/dashboard"} /> : <Outlet />;
};
