import PropTypes from "prop-types";

import styles from "./Loading.module.scss";

const Loading = ({
    size = "md",
    color = "primary",
    className = "",
    text = "",
    fullScreen = false,
    fullscreen = false, // Alternative prop name for backward compatibility
}) => {
    const sizeClass = {
        sm: styles.sm,
        md: styles.md,
        lg: styles.lg,
        xl: styles.xl,
    }[size];

    const colorClass = {
        primary: styles.primary,
        secondary: styles.secondary,
        white: styles.white,
    }[color];

    const isFullScreen = fullScreen || fullscreen;

    const loadingClasses = `${
        styles.loading
    } ${sizeClass} ${colorClass} ${className} ${
        isFullScreen ? styles.fullScreen : ""
    }`.trim();

    if (isFullScreen) {
        return (
            <div className={styles.fullScreenOverlay}>
                <div className={loadingClasses}>
                    <div className={styles.spinner}></div>
                    {text && <p className={styles.text}>{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={loadingClasses}>
            <div className={styles.spinner}></div>
            {text && <p className={styles.text}>{text}</p>}
        </div>
    );
};

Loading.propTypes = {
    size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),
    color: PropTypes.oneOf(["primary", "secondary", "white"]),
    className: PropTypes.string,
    text: PropTypes.string,
    fullScreen: PropTypes.bool,
    fullscreen: PropTypes.bool,
};

export default Loading;
