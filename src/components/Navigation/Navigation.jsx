import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./Navigation.module.scss";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/topics", label: "Topics" },
    { path: "/messages", label: "Messages" },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path} className={styles.navItem}>
            <Link
              to={item.path}
              className={clsx(styles.navLink, {
                [styles.active]: isActive(item.path),
              })}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
