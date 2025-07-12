import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../../components/Header/Header";
import styles from "./FullscreenLayout.module.scss";

const FullscreenLayout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Header className={styles.header} />
            <main className={styles.main}>{children || <Outlet />}</main>
        </div>
    );
};

FullscreenLayout.propTypes = {
    children: PropTypes.node,
};

export default FullscreenLayout;
