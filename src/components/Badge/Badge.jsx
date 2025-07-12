import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./Badge.module.scss";

const Badge = ({
    children,
    variant = "default",
    size = "md",
    className,
    ...props
}) => {
    const badgeClasses = clsx(
        styles.badge,
        styles[variant],
        styles[size],
        className
    );

    return (
        <span className={badgeClasses} {...props}>
            {children}
        </span>
    );
};

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf([
        "default",
        "primary",
        "secondary",
        "success",
        "warning",
        "error",
    ]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    className: PropTypes.string,
};

export default Badge;
