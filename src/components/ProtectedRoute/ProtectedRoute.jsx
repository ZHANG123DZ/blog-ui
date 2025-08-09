import authService from "@/services/auth/auth.service";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(null); // null = chưa biết, true/false sau khi check

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user?.data) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
          navigate("/login", { replace: true });
        }
      } catch (error) {
        setIsAuth(false);
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  // Loading state
  if (!isAuth) {
    return <div>Loading...</div>;
  }

  return children;
}

export default ProtectedRoute;
