import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { path: "/", label: "Home" },
        { path: "/topics", label: "Topics" },
        { path: "/about", label: "About" },
        { path: "/contact", label: "Contact" },
    ];

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    {/* Links */}
                    <div className={styles.links}>
                        <nav className={styles.nav}>
                            <ul className={styles.navList}>
                                {footerLinks.map((link) => (
                                    <li
                                        key={link.path}
                                        className={styles.navItem}
                                    >
                                        <Link
                                            to={link.path}
                                            className={styles.navLink}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Copyright */}
                    <div className={styles.copyright}>
                        <p>&copy; {currentYear} BlogUI. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
