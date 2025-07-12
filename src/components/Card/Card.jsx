import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./Card.module.scss";

const Card = ({
    children,
    variant = "default",
    hoverable = false,
    padding = "md",
    className,
    onClick,
    ...props
}) => {
    const cardClasses = clsx(
        styles.card,
        styles[variant],
        styles[`padding-${padding}`],
        {
            [styles.hoverable]: hoverable,
            [styles.clickable]: onClick,
        },
        className
    );

    const Component = onClick ? "button" : "div";

    return (
        <Component className={cardClasses} onClick={onClick} {...props}>
            {children}
        </Component>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(["default", "outlined", "elevated"]),
    hoverable: PropTypes.bool,
    padding: PropTypes.oneOf(["none", "sm", "md", "lg"]),
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Card;
