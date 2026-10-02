import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../services/auth.service.js";

const ProtectedRoute = ({ children }) => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        await getCurrentUser();
        if (isMounted) {
          setStatus("authenticated");
        }
      } catch {
        if (isMounted) {
          setStatus("unauthenticated");
        }
      }
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
