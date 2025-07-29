import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import FallbackImage from "../FallbackImage/FallbackImage";
import Button from "../Button/Button";
import styles from "./ChatWindow.module.scss";
import messageService from "@/services/message/message.service";
import conversationService from "@/services/conversation/conversation.service";
import socketClient from "@/configs/socketClient";
import { useSelector } from "react-redux";

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
  const cur_user = useSelector((state) => state.auth.currentUser);
  // Mock messages for demonstration
  // const mockMessages = [
  //   {
  //     id: 1,
  //     content: "Hey! How are you doing?",
  //     author: "other",
  //     created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 minutes ago
  //   },
  //   {
  //     id: 2,
  //     content: "I'm good, thanks! Just working on some new blog posts.",
  //     author: "me",
  //     created_at: new Date(Date.now() - 23 * 60 * 1000).toISOString(), // 23 minutes ago
  //   },
  //   {
  //     id: 3,
  //     content: "That sounds interesting! What topics are you covering?",
  //     author: "other",
  //     created_at: new Date(Date.now() - 21 * 60 * 1000).toISOString(), // 21 minutes ago
  //   },
  //   {
  //     id: 4,
  //     content:
  //       "I'm writing about React performance optimization and JavaScript best practices.",
  //     author: "me",
  //     created_at: new Date(Date.now() - 19 * 60 * 1000).toISOString(), // 19 minutes ago
  //   },
  //   {
  //     id: 5,
  //     content: "Wow, those are really hot topics right now! 🔥",
  //     author: "other",
  //     created_at: new Date(Date.now() - 17 * 60 * 1000).toISOString(), // 17 minutes ago
  //   },
  //   {
  //     id: 6,
  //     content:
  //       "Yeah, I've been getting a lot of requests for those topics from readers.",
  //     author: "me",
  //     created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  //   },
  //   {
  //     id: 7,
  //     content: "Have you considered doing a series on advanced React patterns?",
  //     author: "other",
  //     created_at: new Date(Date.now() - 13 * 60 * 1000).toISOString(), // 13 minutes ago
  //   },
  //   {
  //     id: 8,
  //     content:
  //       "That's actually a great idea! I could cover hooks, concontent, custom hooks, and performance patterns.",
  //     author: "me",
  //     created_at: new Date(Date.now() - 11 * 60 * 1000).toISOString(), // 11 minutes ago
  //   },
  //   {
  //     id: 9,
  //     content:
  //       "Perfect! I'd love to read that series. When are you planning to publish?",
  //     author: "other",
  //     created_at: new Date(Date.now() - 9 * 60 * 1000).toISOString(), // 9 minutes ago
  //   },
  //   {
  //     id: 10,
  //     content:
  //       "I'm thinking of starting next week. Want to make sure I have solid examples.",
  //     author: "me",
  //     created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString(), // 7 minutes ago
  //   },
  //   {
  //     id: 11,
  //     content:
  //       "Smart approach! Quality content takes time. Looking forward to it! 👍",
  //     author: "other",
  //     created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  //   },
  //   {
  //     id: 12,
  //     content:
  //       "Thanks for the encouragement! It really helps to have supportive readers like you.",
  //     author: "me",
  //     created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
  //   },
  //   {
  //     id: 13,
  //     content:
  //       "Always happy to support great content creators! Keep up the amazing work! ✨",
  //     author: "other",
  //     created_at: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 minute ago
  //   },
  // ];
  const [conversationId, setConversationId] = useState(null);

  const fetchMessages = async () => {
    try {
      const conversation = await conversationService.getOrCreateConversation(
        user.id
      );
      setConversationId(conversation?.id);
      const msgs = await conversationService.getConversationById(
        conversation?.id
      );
      setMessages(msgs.messages);
      if (conversation && msgs) {
        const data = {
          messageId: msgs.messages[0].id,
          readAt: new Date(),
        };
        await conversationService.markedRead(conversation.id, data);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const getMes = async () => {
        if (user?.id) {
          await fetchMessages();
        }
      };
      getMes();
    }
  }, [isOpen, user?.id]);

  useEffect(() => {
    return () => {
      const markAsRead = async () => {
        if (conversationId && messages?.length > 0 && isOpen) {
          const lastMessage = messages[messages.length - 1];
          const data = {
            messageId: lastMessage.id,
            readAt: new Date(),
          };
          await conversationService.markedRead(conversationId, data);
        }
      };
      markAsRead();
    };
  }, [conversationId, isOpen, messages]);
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
  useEffect(() => {
    if (!conversationId) return;

    const pusher = socketClient;

    const channel = pusher.subscribe(`conversation-${conversationId}`);
    channel.bind("new-message", (newMessage) => {
      if (newMessage.user_id === cur_user.id) {
        newMessage.author = "me";
      } else {
        newMessage.author = "other";
      }
      setMessages((prev) => [...prev, newMessage]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [conversationId]);
  // Additional scroll when window first opens
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollToBottomBtn, setShowScrollToBottomBtn] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Immediate scroll when window opens
      const scrollToBottomImmediate = () => {
        if (messagesEndRef.current) {
          const messagesContainer = messagesEndRef.current.parentElement;
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }
      };

      scrollToBottomImmediate();
      setTimeout(scrollToBottomImmediate, 100);
      setTimeout(scrollToBottomImmediate, 300);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distanceFromBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;

      const atBottom = distanceFromBottom < 100; // 100px trở xuống thì xem như ở dưới cùng
      setIsAtBottom(atBottom);
      setShowScrollToBottomBtn(!atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        conversation_id: conversationId,
        content: message.trim(),
        created_at: new Date().toISOString(),
      };
      try {
        await messageService.createMessage(conversationId, newMessage);
        setMessage("");
      } catch (error) {
        console.log(error);
        setMessage("");
      }
      return;
    }
  };

  const handleOpenInMessages = () => {
    navigate("/messages");
    onClose();
  };

  const formatTime = (created_at) => {
    return new Date(created_at).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className={styles.minimizedWindow} onClick={() => onMinimize(false)}>
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
            <span className={styles.status}>Hoạt động 5 phút trước</span>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h12v2H6z" />
            </svg>
          </button>

          {/* Close button */}
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close chat"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages} ref={messagesContainerRef}>
        {messages.map((msg) => (
          <div
            key={msg?.id}
            className={`${styles.message} ${
              msg.author === "me" ? styles.own : styles.other
            }`}
          >
            <div className={styles.messageContent}>
              <p className={styles.messageText}>{msg.content}</p>
              <span className={styles.messageTime}>
                {formatTime(msg.created_at)}
              </span>
            </div>
          </div>
        ))}
        {showScrollToBottomBtn && (
          <button
            className="scroll-to-bottom-btn"
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            ↓
          </button>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        className={styles.inputForm}
        onSubmit={async (e) => await handleSendMessage(e)}
      >
        <input
          type="content"
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </Button>
      </form>
    </div>
  );
};

ChatWindow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
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
