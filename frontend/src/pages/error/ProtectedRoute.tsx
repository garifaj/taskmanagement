import { Navigate } from "react-router-dom";
import { ReactNode, useContext } from "react";
import { UserContext } from "../../context/user/UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, ready } = useContext(UserContext);

  // While waiting for user data to load
  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  // After loading, check if user is logged in
  if (!user) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
