import PropTypes from "prop-types";
import clsx from "clsx";
import styles from "./Input.module.scss";

const Input = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    helperText,
    disabled = false,
    required = false,
    fullWidth = false,
    size = "md",
    className,
    id,
    name,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const inputClasses = clsx(
        styles.input,
        styles[size],
        {
            [styles.error]: error,
            [styles.disabled]: disabled,
            [styles.fullWidth]: fullWidth,
        },
        className
    );

    return (
        <div className={styles.container}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                </label>
            )}

            <div className={styles.inputWrapper}>
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    className={inputClasses}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={disabled}
                    required={required}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : helperText
                            ? `${inputId}-helper`
                            : undefined
                    }
                    {...props}
                />
            </div>

            {error && (
                <div id={`${inputId}-error`} className={styles.errorText}>
                    {error}
                </div>
            )}

            {helperText && !error && (
                <div id={`${inputId}-helper`} className={styles.helperText}>
                    {helperText}
                </div>
            )}
        </div>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    error: PropTypes.string,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    fullWidth: PropTypes.bool,
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    className: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
};

export default Input;
