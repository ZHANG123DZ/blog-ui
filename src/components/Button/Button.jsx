import PropTypes from "prop-types";
import clsx from "clsx";
import { Children, cloneElement, isValidElement } from "react";
import styles from "./Button.module.scss";

const Button = ({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    fullWidth = false,
    type = "button",
    component: Component = "button",
    onClick,
    className,
    asChild = false,
    ...props
}) => {
    const buttonClasses = clsx(
        styles.button,
        styles[variant],
        styles[size],
        {
            [styles.disabled]: disabled,
            [styles.loading]: loading,
            [styles.fullWidth]: fullWidth,
        },
        className
    );

    const content = (
        <>
            {loading && <span className={styles.spinner} aria-hidden="true" />}
            <span className={loading ? styles.hiddenText : ""}>{children}</span>
        </>
    );

    if (asChild) {
        const child = Children.only(children);
        if (isValidElement(child)) {
            return cloneElement(child, {
                className: clsx(buttonClasses, child.props.className),
                ...props,
                children: child.props.children,
            });
        }
    }

    return (
        <Component
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={onClick}
            {...props}
        >
            {content}
        </Component>
    );
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    component: PropTypes.elementType,
    variant: PropTypes.oneOf(["primary", "secondary", "ghost", "danger"]),
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    fullWidth: PropTypes.bool,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    onClick: PropTypes.func,
    className: PropTypes.string,
    asChild: PropTypes.bool,
};

export default Button;
