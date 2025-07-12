import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import FallbackImage from "../FallbackImage/FallbackImage";
import Button from "../Button/Button";
import styles from "./ChatWindow.module.scss";

const ChatWindow = ({
    user,
    isOpen = false,
    onClose,
    onMinimize,
    isMinimized = false,
    ...props
}) => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);

    // Mock messages for demonstration
    const mockMessages = [
        {
            id: 1,
            text: "Hey! How are you doing?",
            sender: "other",
            timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
        },
        {
            id: 2,
            text: "I'm good, thanks! Just working on some new blog posts.",
            sender: "me",
            timestamp: new Date(Date.now() - 23 * 60 * 1000).toISOString(), // 23 minutes ago
        },
        {
            id: 3,
            text: "That sounds interesting! What topics are you covering?",
            sender: "other",
            timestamp: new Date(Date.now() - 21 * 60 * 1000).toISOString(), // 21 minutes ago
        },
        {
            id: 4,
            text: "I'm writing about React performance optimization and JavaScript best practices.",
            sender: "me",
            timestamp: new Date(Date.now() - 19 * 60 * 1000).toISOString(), // 19 minutes ago
        },
        {
            id: 5,
            text: "Wow, those are really hot topics right now! 🔥",
            sender: "other",
            timestamp: new Date(Date.now() - 17 * 60 * 1000).toISOString(), // 17 minutes ago
        },
        {
            id: 6,
            text: "Yeah, I've been getting a lot of requests for those topics from readers.",
            sender: "me",
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
        },
        {
            id: 7,
            text: "Have you considered doing a series on advanced React patterns?",
            sender: "other",
            timestamp: new Date(Date.now() - 13 * 60 * 1000).toISOString(), // 13 minutes ago
        },
        {
            id: 8,
            text: "That's actually a great idea! I could cover hooks, context, custom hooks, and performance patterns.",
            sender: "me",
            timestamp: new Date(Date.now() - 11 * 60 * 1000).toISOString(), // 11 minutes ago
        },
        {
            id: 9,
            text: "Perfect! I'd love to read that series. When are you planning to publish?",
            sender: "other",
            timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString(), // 9 minutes ago
        },
        {
            id: 10,
            text: "I'm thinking of starting next week. Want to make sure I have solid examples.",
            sender: "me",
            timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(), // 7 minutes ago
        },
        {
            id: 11,
            text: "Smart approach! Quality content takes time. Looking forward to it! 👍",
            sender: "other",
            timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
        },
        {
            id: 12,
            text: "Thanks for the encouragement! It really helps to have supportive readers like you.",
            sender: "me",
            timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
        },
        {
            id: 13,
            text: "Always happy to support great content creators! Keep up the amazing work! ✨",
            sender: "other",
            timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
        },
    ];

    useEffect(() => {
        setMessages(mockMessages);
    }, []);

    // Scroll to bottom when window opens or when new messages arrive
    useEffect(() => {
        if (isOpen && !isMinimized && messages.length > 0) {
            // Multiple attempts to ensure scroll works
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: "instant",
                    block: "end",
                });
            }, 0);

            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: "instant",
                    block: "end",
                });
            }, 50);

            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: "instant",
                    block: "end",
                });
            }, 150);
        }
    }, [isOpen, isMinimized, messages]);

    // Additional scroll when window first opens
    useEffect(() => {
        if (isOpen && !isMinimized) {
            // Immediate scroll when window opens
            const scrollToBottomImmediate = () => {
                if (messagesEndRef.current) {
                    const messagesContainer =
                        messagesEndRef.current.parentElement;
                    if (messagesContainer) {
                        messagesContainer.scrollTop =
                            messagesContainer.scrollHeight;
                    }
                }
            };

            scrollToBottomImmediate();
            setTimeout(scrollToBottomImmediate, 100);
            setTimeout(scrollToBottomImmediate, 300);
        }
    }, [isOpen, isMinimized]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message.trim(),
                sender: "me",
                timestamp: new Date().toISOString(),
            };
            setMessages([...messages, newMessage]);
            setMessage("");
        }
    };

    const handleOpenInMessages = () => {
        navigate("/messages");
        onClose();
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (!isOpen) return null;

    if (isMinimized) {
        return (
            <div
                className={styles.minimizedWindow}
                onClick={() => onMinimize(false)}
            >
                <FallbackImage
                    src={user?.avatar}
                    alt={user?.name}
                    className={styles.minimizedAvatar}
                />
                <span className={styles.minimizedName}>{user?.name}</span>
            </div>
        );
    }

    return (
        <div className={styles.chatWindow} {...props}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.userInfo}>
                    <FallbackImage
                        src={user?.avatar}
                        alt={user?.name}
                        className={styles.avatar}
                    />
                    <div className={styles.userDetails}>
                        <span className={styles.name}>{user?.name}</span>
                        <span className={styles.status}>
                            Hoạt động 5 phút trước
                        </span>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    {/* Menu button */}
                    <div className={styles.menuContainer} ref={menuRef}>
                        <button
                            className={styles.menuButton}
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="More options"
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                            </svg>
                        </button>

                        {isMenuOpen && (
                            <div className={styles.menu}>
                                <button
                                    className={styles.menuItem}
                                    onClick={handleOpenInMessages}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M21 6h-2l-1.27-1.27c-.19-.19-.44-.29-.7-.29-.26 0-.51.1-.7.29L15 6H9L7.67 4.73c-.19-.19-.44-.29-.7-.29-.26 0-.51.1-.7.29L5 6H3c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1zM12 16c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
                                    </svg>
                                    Mở trong Messages
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Minimize button */}
                    <button
                        className={styles.minimizeButton}
                        onClick={() => onMinimize(true)}
                        aria-label="Minimize"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M6 19h12v2H6z" />
                        </svg>
                    </button>

                    {/* Close button */}
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close chat"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className={styles.messages}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.message} ${
                            msg.sender === "me" ? styles.own : styles.other
                        }`}
                    >
                        <div className={styles.messageContent}>
                            <p className={styles.messageText}>{msg.text}</p>
                            <span className={styles.messageTime}>
                                {formatTime(msg.timestamp)}
                            </span>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className={styles.inputForm} onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className={styles.input}
                />
                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!message.trim()}
                    className={styles.sendButton}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </Button>
            </form>
        </div>
    );
};

ChatWindow.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string,
    }).isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onMinimize: PropTypes.func.isRequired,
    isMinimized: PropTypes.bool,
};

export default ChatWindow;
