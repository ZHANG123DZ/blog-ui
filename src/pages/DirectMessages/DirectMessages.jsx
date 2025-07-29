import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import styles from "./DirectMessages.module.scss";
import socketClient from "@/configs/socketClient";
import conversationService from "@/services/conversation/conversation.service";
import messageService from "@/services/message/message.service";
import { useSelector } from "react-redux";
import InvitationMessageModal from "@/components/InvitationMessageModal/InvitationMessageModal";

const DirectMessages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const cur_user = useSelector((state) => state.auth.currentUser);
  // Mock data - in real app this would come from API
  // const [conversations, setConversations] = useState([
  //   {
  //     id: 1,
  //     users: {
  //       id: 2,
  //       name: "Sarah Chen",
  //       username: "sarahc",
  //       avatar:
  //         "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
  //     },
  //     lastMessage: {
  //       text: "Hey! Did you see the latest blog post about React hooks?",
  //       timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
  //       senderId: 2,
  //     },
  //     unreadCount: 2,
  //     isOnline: true,
  //   },
  //   {
  //     id: 2,
  //     users: {
  //       id: 3,
  //       name: "Alex Johnson",
  //       username: "alexj",
  //       avatar:
  //         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
  //     },
  //     lastMessage: {
  //       text: "Thanks for the feedback on my article!",
  //       timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  //       senderId: 1,
  //     },
  //     unreadCount: 0,
  //     isOnline: false,
  //   },
  //   {
  //     id: 3,
  //     users: {
  //       id: 4,
  //       name: "Emily Davis",
  //       username: "emilyd",
  //       avatar:
  //         "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
  //     },
  //     lastMessage: {
  //       text: "Would love to collaborate on a project!",
  //       timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  //       senderId: 4,
  //     },
  //     unreadCount: 1,
  //     isOnline: true,
  //   },
  // ]);

  // const [messages, setMessages] = useState({
  //   1: [
  //     {
  //       id: 1,
  //       text: "Hi! I really enjoyed your latest post about TypeScript best practices.",
  //       senderId: 2,
  //       timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  //     },
  //     {
  //       id: 2,
  //       text: "Thank you! I'm glad you found it helpful. Are you using TypeScript in your projects?",
  //       senderId: 1,
  //       timestamp: new Date(Date.now() - 90 * 60 * 1000),
  //     },
  //     {
  //       id: 3,
  //       text: "Yes, we just migrated our entire React app to TypeScript. The type safety is amazing!",
  //       senderId: 2,
  //       timestamp: new Date(Date.now() - 60 * 60 * 1000),
  //     },
  //     {
  //       id: 4,
  //       text: "Hey! Did you see the latest blog post about React hooks?",
  //       senderId: 2,
  //       timestamp: new Date(Date.now() - 30 * 60 * 1000),
  //     },
  //   ],
  //   2: [
  //     {
  //       id: 5,
  //       text: "Thanks for the feedback on my article!",
  //       senderId: 1,
  //       timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  //     },
  //   ],
  //   3: [
  //     {
  //       id: 6,
  //       text: "Would love to collaborate on a project!",
  //       senderId: 4,
  //       timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  //     },
  //   ],
  // });
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  // Get conversation ID from URL params

  //Lấy hết các cuộc hội thoại mà 1 người tham gia
  useEffect(() => {
    const fetchConversations = async () => {
      const myConversations = await conversationService.getConversations();
      setConversations(myConversations);
    };
    fetchConversations();
  }, []);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || conversations.length === 0) return;

    const conversationId = searchParams.get("conversation");

    if (!conversationId) {
      setSelectedConversation(null);
      return;
    }

    const found = conversations.find(
      (c) => parseInt(c.id) === parseInt(conversationId)
    );
    setSelectedConversation(found || null);
    if (found) markAsRead(found.id);
    setInitialized(true);
  }, [conversations, searchParams]);

  // Remove conversations from dependency to avoid infinite loop

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markAsRead = (conversationId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setSearchParams({ conversation: conversation.id.toString() });
    markAsRead(conversation.id);
  };

  //Đoạn này lấy mes của conversation
  useEffect(() => {
    if (!selectedConversation) return;
    const fetchMessages = async () => {
      if (selectedConversation) {
        const myMessages = await messageService.getMessagesByConversationId(
          selectedConversation.id
        );
        setCurrentMessages(myMessages);
      }
    };
    fetchMessages();
  }, [conversations, selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      conversation_id: selectedConversation.id,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };
    try {
      await messageService.createMessage(selectedConversation.id, message);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    date = new Date(date);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Cái này gọi soketi
  useEffect(() => {
    if (!conversations) return;

    const pusher = socketClient;
    const channels = [];

    conversations.forEach((conversation) => {
      const channel = pusher.subscribe(`conversation-${conversation.id}`);
      channels.push(channel);

      channel.bind("new-message", (newMessage) => {
        if (newMessage.user_id === cur_user.id) {
          newMessage.author = "me";
        } else {
          newMessage.author = "other";
        }

        // Nếu đang xem đúng conversation thì mới thêm vào
        if (selectedConversation?.id === conversation.id) {
          setCurrentMessages((prev) => [...prev, newMessage]);
        }
        setConversations((prev) =>
          prev.map((c) =>
            c.id === newMessage.conversation_id
              ? { ...c, lastMessage: newMessage }
              : c
          )
        );
      });
    });

    return () => {
      channels.forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
    };
  }, [conversations, cur_user.id, selectedConversation?.id]);
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Conversations Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h1 className={styles.title}>Messages</h1>
            <InvitationMessageModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onSend={handleSendMessage}
            />
            <Button
              onClick={() => setOpen(!open)}
              variant="ghost"
              size="sm"
              className={styles.newMessageButton}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </Button>
          </div>

          <div className={styles.searchSection}>
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.conversationsList}>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`${styles.conversationItem} ${
                  selectedConversation?.id === conversation.id
                    ? styles.selected
                    : ""
                }`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className={styles.avatarContainer}>
                  <FallbackImage
                    src={conversation.avatar_url}
                    alt={conversation.name}
                    className={styles.avatar}
                  />
                  {conversation.users.isOnline && (
                    <div className={styles.onlineIndicator} />
                  )}
                </div>

                <div className={styles.conversationContent}>
                  <div className={styles.conversationHeader}>
                    <span className={styles.usersName}>
                      {conversation.name}
                    </span>
                    <span className={styles.timestamp}>
                      {formatTime(conversation.lastMessage?.updated_at)}
                    </span>
                  </div>
                  <div className={styles.lastMessage}>
                    <span className={styles.messageText}>
                      {conversation.lastMessage?.content}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className={styles.unreadBadge}>
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className={styles.messagesArea}>
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className={styles.messagesHeader}>
                <div className={styles.usersInfo}>
                  <FallbackImage
                    src={selectedConversation.avatar_url}
                    alt={selectedConversation.name}
                    className={styles.headerAvatar}
                  />
                  <div>
                    <h2 className={styles.usersName}>
                      {selectedConversation.name}
                    </h2>
                    <span className={styles.usersStatus}>
                      {selectedConversation.users.isOnline
                        ? "Online"
                        : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Thread */}
              <div className={styles.messagesThread}>
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`${styles.message} ${
                      message.author === "me" ? styles.sent : styles.received
                    }`}
                  >
                    <div className={styles.messageContent}>
                      <span className={styles.messageText}>
                        {message.content}
                      </span>
                      <span className={styles.messageTime}>
                        {formatTime(message?.updated_at)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className={styles.messageInputContainer}>
                <div className={styles.messageInputWrapper}>
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Message ${selectedConversation.name}...`}
                    className={styles.messageInput}
                    rows={1}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={styles.sendButton}
                    size="sm"
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
                </div>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateContent}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={styles.emptyIcon}
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <h3 className={styles.emptyTitle}>Select a conversation</h3>
                <p className={styles.emptyDescription}>
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectMessages;
