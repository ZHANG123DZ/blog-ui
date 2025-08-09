import { Outlet, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./AuthLayout.module.scss";
import { useEffect, useState } from "react";
import authService from "@/services/auth/auth.service";

const AuthLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(null); // null = chưa biết, true/false sau khi check

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user?.data) {
          setIsAuth(true);
          navigate("/", { replace: true });
        } else {
          setIsAuth(false);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        {/* Auth Content */}
        <div className={styles.content}>{children || <Outlet />}</div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className="text-muted text-center">
            &copy; 2024 BlogUI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
};

export default AuthLayout;
