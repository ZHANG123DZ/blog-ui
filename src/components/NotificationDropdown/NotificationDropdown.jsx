import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Badge from "../Badge/Badge";
import styles from "./NotificationDropdown.module.scss";

const NotificationDropdown = ({
  notifications = [],
  unreadCount = 0,
  isOpen = false,
  onToggle,
  onMarkAsRead,
  onMarkAllAsRead,
  className,
  ...props
}) => {
  const [markingAsRead, setMarkingAsRead] = useState(new Set());
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const notificationRefs = useRef([]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      // Focus first focusable element when opening
      const firstFocusable = dropdownRef.current.querySelector(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    } else if (!isOpen && triggerRef.current) {
      // Return focus to trigger when closing
      triggerRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation handler
  const handleKeyDown = (event) => {
    if (!isOpen) return;

    const notificationElements = notificationRefs.current.filter(Boolean);
    const maxIndex = Math.max(0, notificationElements.length - 1);

    switch (event.key) {
      case "Escape":
        event.preventDefault();
        onToggle();
        break;
      case "ArrowDown":
        event.preventDefault();
        setFocusedIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case "Enter":
      case " ":
        if (focusedIndex >= 0 && notificationElements[focusedIndex]) {
          event.preventDefault();
          notificationElements[focusedIndex].click();
        }
        break;
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    if (!onMarkAsRead || markingAsRead.has(notificationId)) return;

    setMarkingAsRead((prev) => new Set(prev).add(notificationId));

    try {
      await onMarkAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setMarkingAsRead((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!onMarkAllAsRead) return;

    try {
      await onMarkAllAsRead();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case "comment":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M14 10c0 .6-.4 1-1 1H4l-3 3V3c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7z" />
          </svg>
        );
      case "follow":
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z" />
          </svg>
        );
      default:
        return (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM7 3H9V9H7V3ZM8 13C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11C8.55 11 9 11.45 9 12C9 12.55 8.55 13 8 13Z" />
          </svg>
        );
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "like":
        return styles.likeNotification;
      case "comment":
        return styles.commentNotification;
      case "follow":
        return styles.followNotification;
      default:
        return styles.defaultNotification;
    }
  };

  return (
    <div
      className={`${styles.notificationDropdown} ${className || ""}`}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${isOpen ? styles.active : ""}`}
        onClick={onToggle}
        aria-label={`Notifications${
          unreadCount > 0 ? ` (${unreadCount} unread)` : ""
        }`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="notifications-dropdown"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <Badge
            variant="error"
            size="sm"
            className={styles.badge}
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          id="notifications-dropdown"
          className={styles.dropdown}
          role="menu"
          aria-label="Notifications menu"
        >
          <div className={styles.header}>
            <h3 className={styles.title} id="notifications-title">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                className={styles.markAllRead}
                onClick={handleMarkAllAsRead}
                role="menuitem"
                aria-label="Mark all notifications as read"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className={styles.content} aria-labelledby="notifications-title">
            {notifications.length === 0 ? (
              <div className={styles.empty} role="status" aria-live="polite">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  aria-hidden="true"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <p>No notifications yet</p>
              </div>
            ) : (
              <div
                className={styles.list}
                role="group"
                aria-label="Notification list"
              >
                {notifications.slice(0, 10).map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.link || "#"}
                    className={`${styles.item} ${
                      !notification.read ? styles.unread : ""
                    } ${getNotificationTypeColor(notification.type)}`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className={styles.icon}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className={styles.itemContent}>
                      <div className={styles.message}>
                        {notification?.message || []}
                      </div>
                      <time className={styles.time}>
                        {formatTimeAgo(notification.createdAt)}
                      </time>
                    </div>

                    {!notification.read && (
                      <button
                        className={styles.markRead}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        disabled={markingAsRead.has(notification.id)}
                        title="Mark as read"
                      >
                        <div className={styles.unreadDot} />
                      </button>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {notifications.length > 10 && (
              <div className={styles.footer}>
                <Link to="/notifications" className={styles.viewAll}>
                  View all notifications
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

NotificationDropdown.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(["like", "comment", "follow", "general"])
        .isRequired,
      message: PropTypes.string,
      link: PropTypes.string,
      read: PropTypes.bool,
      createdAt: PropTypes.string,
    })
  ),
  unreadCount: PropTypes.number,
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onMarkAsRead: PropTypes.func,
  onMarkAllAsRead: PropTypes.func,
  className: PropTypes.string,
};

export default NotificationDropdown;
