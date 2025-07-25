import PropTypes from "prop-types";
import clsx from "clsx";
import Button from "../Button/Button";
import styles from "./EmptyState.module.scss";

const EmptyState = ({
  title = "No data found",
  description,
  icon,
  actionText,
  onAction,
  actionButton,
  className,
  ...props
}) => {
  return (
    <div className={clsx(styles.emptyState, className)} {...props}>
      {icon && (
        <div className={styles.icon}>
          {typeof icon === "string" ? (
            <span className={styles.emoji}>{icon}</span>
          ) : (
            icon
          )}
        </div>
      )}

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {actionText && onAction && (
        <div className={styles.action}>
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
      {actionButton ? (
        <div className={styles.action}>{actionButton}</div>
      ) : (
        actionText &&
        onAction && (
          <div className={styles.action}>
            <Button variant="primary" onClick={onAction}>
              {actionText}
            </Button>
          </div>
        )
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  actionText: PropTypes.string,
  onAction: PropTypes.func,
  actionButton: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;
