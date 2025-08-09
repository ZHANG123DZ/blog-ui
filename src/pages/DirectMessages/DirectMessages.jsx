import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import styles from "./DirectMessages.module.scss";
import socketClient from "@/configs/socketClient";
import conversationService from "@/services/conversation/conversation.service";
import messageService from "@/services/message/message.service";
import { useSelector } from "react-redux";
import InvitationMessageModal from "@/components/InvitationMessageModal/InvitationMessageModal";
import markAsReadOnServer from "@/function/markAsReadOnServer";
import { useOnlineUsers } from "@/stores/useOnlineUsers";

const DirectMessages = () => {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const messagesEndRef = useRef(null);
  const cur_user = useSelector((state) => state.auth.currentUser);
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const onlineUsers = useOnlineUsers((s) => s.onlineUsers);

  // Lấy tất cả conversations
  useEffect(() => {
    const fetchConversations = async () => {
      const myConversations = await conversationService.getConversations();
      const priorityConversations = [...myConversations].sort((a, b) => {
        const timeA = new Date(a.lastMessage?.created_at || 0).getTime();
        const timeB = new Date(b.lastMessage?.created_at || 0).getTime();
        return timeB - timeA;
      });
      setConversations(priorityConversations);
    };
    fetchConversations();
  }, []);

  // Chọn conversation từ URL nếu có
  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (!conversationId) {
      setSelectedConversation(null);
      return;
    }
    const found = conversations.find(
      (c) => parseInt(c.id) === parseInt(conversationId)
    );
    if (found) {
      setSelectedConversation(found);
    }
  }, [conversations, searchParams]);
  // Cập nhật unreadCount ở FE
  const markAsRead = (conversationId) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  };
  // Hàm gọi API mark-as-read
  const doMarkAsRead = async (conversation, messages) => {
    if (!conversation) return;
    const lastFromOther = [...(messages || currentMessages)]
      .sort((a, b) => b.id - a.id) // newest first
      .find((m) => m.user_id !== cur_user.id);

    if (lastFromOther) {
      await markAsReadOnServer(conversation.id, lastFromOther.id, new Date());
      markAsRead(conversation.id);
    }
  };

  // Khi mở conversation → fetch messages + mark 1 lần
  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      const myMessages = await messageService.getMessagesByConversationId(
        selectedConversation.id
      );
      setCurrentMessages(myMessages);

      // Mark khi mở lần đầu
      if (!hasMarkedRead) {
        await doMarkAsRead(selectedConversation, myMessages);
        setHasMarkedRead(false);
      }
    };

    fetchMessages();
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedConversation?.id ? { ...c, unreadCount: 0 } : c
      )
    );
  }, [selectedConversation?.id]);

  // Khi rời conversation → mark lại nếu cần
  useEffect(() => {
    return () => {
      if (selectedConversation && currentMessages.length) {
        doMarkAsRead(selectedConversation, currentMessages);
      }
      setHasMarkedRead(false);
    };
  }, [selectedConversation?.id]);

  // Auto-scroll khi tin nhắn thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversation?.id ? { ...c, unreadCount: 0 } : c
      )
    );
    setSearchParams({ conversation: conversation.id.toString() });
  };

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
      const botUser = selectedConversation.users.find(
        (user) => user.role === "bot"
      );

      if (botUser && botUser?.id) {
        await messageService.chatAI(selectedConversation.id, {
          input: message.content,
          botId: botUser.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
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
  const gotoProfile = () => {
    const other = selectedConversation.users.find(
      (user) => user.username !== cur_user.username
    );
    navigate(`/profile/${other.username}`);
  };
  // Socket: nghe tin nhắn mới
  useEffect(() => {
    if (!conversations.length) return;
    const pusher = socketClient;
    const channels = [];

    conversations.forEach((conversation) => {
      const channel = pusher.subscribe(`conversation-${conversation.id}`);
      channels.push(channel);

      channel.bind("new-message", async (newMessage) => {
        if (newMessage.user_id === cur_user.id) {
          newMessage.author = "me";
        } else {
          newMessage.author = "other";
        }

        // Nếu đang mở conversation và tin nhắn là của người kia → mark read
        if (
          selectedConversation?.id === newMessage.conversation_id &&
          newMessage.user_id !== cur_user.id
        ) {
          await markAsReadOnServer(
            newMessage.conversation_id,
            newMessage.id,
            new Date()
          );
          markAsRead(newMessage.conversation_id);
        }

        // Update danh sách conversation
        setConversations((prev) => {
          // Cập nhật conversation
          const updated = prev.map((c) => {
            if (c.id !== newMessage.conversation_id) return c;
            return {
              ...c,
              lastMessage: newMessage,
              unreadCount:
                selectedConversation?.id === c.id
                  ? 0
                  : (c.unreadCount || 0) + 1,
            };
          });

          // Đưa conversation vừa có tin nhắn mới lên đầu
          return updated.sort((a, b) => {
            if (a.id === newMessage.conversation_id) return -1; // a lên trước
            if (b.id === newMessage.conversation_id) return 1; // b lên trước
            return 0; // giữ nguyên thứ tự cũ
          });
        });

        // Nếu đang mở thì thêm vào messages
        if (selectedConversation?.id === conversation.id) {
          setCurrentMessages((prev) => [...prev, newMessage]);
        }
      });
    });

    return () => {
      channels.forEach((channel) => {
        channel.unbind_all();
        pusher.unsubscribe(channel.name);
      });
    };
  }, [conversations, cur_user.id, selectedConversation?.id]);

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Sidebar */}
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
                  {conversation.users.find(
                    (user) => onlineUsers[user.id] && user.id !== cur_user.id
                  ) && <div className={styles.onlineIndicator} />}
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

        {/* Messages */}
        <div className={styles.messagesArea}>
          {selectedConversation ? (
            <>
              <div className={styles.messagesHeader}>
                <div className={styles.usersInfo}>
                  <FallbackImage
                    src={selectedConversation.avatar_url}
                    alt={selectedConversation.name}
                    className={styles.headerAvatar}
                  />
                  <div>
                    <h2
                      className={styles.usersName}
                      onClick={() => {
                        if (selectedConversation.users.length === 2) {
                          gotoProfile();
                        }
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {selectedConversation.name}
                    </h2>
                    <span className={styles.usersStatus}>
                      {selectedConversation.users.find(
                        (user) =>
                          onlineUsers[user.id] && user.id !== cur_user.id
                      )
                        ? "Online"
                        : "Offline"}
                    </span>
                  </div>
                </div>
              </div>

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
