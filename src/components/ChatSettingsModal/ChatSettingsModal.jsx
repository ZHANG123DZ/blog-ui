import { useState, useRef, useEffect } from "react";
import styles from "./ChatSettingsModal.module.scss";
import conversationService from "@/services/conversation/conversation.service";
import mediaService from "@/services/media/media.service";
import AvatarConversation from "../AvatarConversation/AvatarConversation";
import anyUrlToFile from "@/utils/anyUrlToFile";
import userService from "@/services/user/user.service";

const ChatSettingsModal = ({
  isOpen = true,
  conversationData = {},
  onClose = () => {},
  onSave = () => {},
}) => {
  // Seed demo tất cả user

  const [editedConversation, setEditedConversation] = useState({});
  const [isViewingMembers, setIsViewingMembers] = useState(false);
  const [isAddingMembers, setIsAddingMembers] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const fileInputRef = useRef(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const users = await userService.getUsers(1, 30);
      setAllUsers(users.data);
    };
    getUsers();
  }, []);

  useEffect(() => {
    setEditedConversation(conversationData);
  }, [conversationData]);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setEditedConversation((prev) => ({
        ...prev,
        avatar_file: file,
        avatar_url: blobUrl,
      }));
      event.target.value = "";
    }
  };

  const handleLeaveChat = async () => {
    if (window.confirm("Bạn có chắc chắn muốn rời khỏi đoạn chat này không?")) {
      await conversationService.leaveGroup(conversationData.id);
      onClose();
    }
  };

  const handleSaveSettings = async () => {
    if (editedConversation.avatar_url) {
      const fileAvatar = await anyUrlToFile(
        editedConversation.avatar_url,
        "cover"
      );
      const urlAvatar = await mediaService.uploadSingleFile({
        avatar: fileAvatar,
        folder: `group/avatar`,
      });
      editedConversation.avatar_url = urlAvatar.data.url;
    }

    await conversationService.updateConversation(editedConversation.id, {
      avatar_url: editedConversation.avatar_url,
      name: editedConversation.name,
    });
    onSave(editedConversation);
    onClose();
  };

  const handleToggleUserSelect = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddSelectedUsers = async () => {
    const newUsersId = allUsers
      .filter((u) => selectedUserIds.includes(u.id))
      .map((u) => u.id);
    await conversationService.joinGroup(conversationData.id, {
      participantsId: newUsersId,
    });
    setSelectedUserIds([]);
    setIsAddingMembers(false);
  };

  if (!isOpen) return null;
  if (!conversationData) return null;

  // Lọc user chưa có trong chat
  const availableUsersToAdd = allUsers.filter(
    (u) => !editedConversation.users.some((member) => member.id === u.id)
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Cài đặt đoạn chat</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Màn chính */}
        {!isViewingMembers && !isAddingMembers && (
          <div className={styles.modalBody}>
            <div className={styles.avatarSection}>
              <div
                className={styles.avatarContainer}
                onClick={() => fileInputRef.current?.click()}
              >
                <AvatarConversation
                  conversation={editedConversation}
                  className="avatarGroup"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className={styles.hiddenInput}
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
                <button
                  type="button"
                  className={styles.changeAvatarBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  &#9998;
                </button>
              </div>
              <input
                className={styles.chatName}
                value={editedConversation.name}
                style={{ border: "0px", textAlign: "center" }}
                onChange={(e) =>
                  setEditedConversation({
                    ...editedConversation,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <ul className={styles.settingsList}>
              <li>
                <button
                  onClick={() => setIsAddingMembers(true)}
                  className={styles.settingsItem}
                >
                  <span className={styles.settingsItemText}>
                    Thêm người vào đoạn chat
                  </span>
                  <span>&rarr;</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsViewingMembers(true)}
                  className={styles.settingsItem}
                >
                  <span className={styles.settingsItemText}>
                    Xem thành viên
                  </span>
                  <span>&rarr;</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleLeaveChat}
                  className={`${styles.settingsItem} ${styles.redText}`}
                >
                  <span className={styles.settingsItemText}>
                    Rời khỏi đoạn chat
                  </span>
                  <span>&rarr;</span>
                </button>
              </li>
            </ul>

            <button
              onClick={handleSaveSettings}
              className={styles.saveBtn}
              type="button"
            >
              Lưu thay đổi
            </button>
          </div>
        )}

        {/* Màn xem thành viên */}
        {isViewingMembers && (
          <div className={styles.modalBody}>
            <div className={styles.membersHeader}>
              <button type="button" onClick={() => setIsViewingMembers(false)}>
                &larr;
              </button>
              <h3>Thành viên ({editedConversation.users?.length || 0})</h3>
            </div>
            {editedConversation.users?.length > 0 ? (
              <ul className={styles.membersList}>
                {editedConversation.users.map((user) => (
                  <li key={user.id} className={styles.memberItem}>
                    <img
                      src={user.avatar_url || "/placeholder-avatar.png"}
                      alt={user.full_name}
                      className={styles.memberAvatar}
                    />
                    <span>{user.full_name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noMembers}>Chưa có thành viên nào</p>
            )}
          </div>
        )}

        {/* Màn thêm thành viên */}
        {isAddingMembers && (
          <div className={styles.modalBody}>
            <div className={styles.membersHeader}>
              <button type="button" onClick={() => setIsAddingMembers(false)}>
                &larr;
              </button>
              <h3>Thêm người vào đoạn chat</h3>
            </div>
            {availableUsersToAdd.length > 0 ? (
              <ul className={styles.membersList}>
                {availableUsersToAdd.map((user) => (
                  <li key={user.id} className={styles.memberItem}>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => handleToggleUserSelect(user.id)}
                    />
                    <img
                      src={user.avatar_url || "/placeholder-avatar.png"}
                      alt={user.full_name}
                      className={styles.memberAvatar}
                    />
                    <span>{user.full_name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noMembers}>Không còn ai để thêm</p>
            )}
            <button
              className={styles.saveBtn}
              onClick={handleAddSelectedUsers}
              disabled={selectedUserIds.length === 0}
            >
              Thêm vào đoạn chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSettingsModal;
