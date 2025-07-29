import { useState, useEffect, useRef } from "react";
import styles from "./InvitationMessageModal.module.scss";

// Seeder: giả lập danh sách người có thể nhắn tin
const mockReceivers = [
  { id: 1, name: "Alice", avatar_url: "/avatars/alice.jpg" },
  { id: 2, name: "Bob", avatar_url: "/avatars/bob.jpg" },
  { id: 3, name: "Charlie", avatar_url: "/avatars/charlie.jpg" },
  { id: 4, name: "David", avatar_url: "/avatars/david.jpg" },
  { id: 5, name: "Eve", avatar_url: "/avatars/eve.jpg" },
  { id: 6, name: "Frank", avatar_url: "/avatars/frank.jpg" },
  { id: 7, name: "Grace", avatar_url: "/avatars/grace.jpg" },
  { id: 8, name: "Heidi", avatar_url: "/avatars/heidi.jpg" },
];

export default function InvitationMessageModal({ isOpen, onClose, onSend }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReceivers, setFilteredReceivers] = useState(mockReceivers);
  const [selectedReceivers, setSelectedReceivers] = useState([]);
  const modalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    // Reset modal state when opening
    setSearchTerm("");
    setFilteredReceivers(mockReceivers);
    setSelectedReceivers([]);
  }, [isOpen]);

  // Debounce searchTerm -> filter users
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const keyword = searchTerm.toLowerCase().trim();
      const results = mockReceivers.filter((user) =>
        user.name.toLowerCase().includes(keyword)
      );
      setFilteredReceivers(results);
    }, 800);
    return () => clearTimeout(timeoutRef.current);
  }, [searchTerm]);

  const handleToggleReceiver = (user) => {
    setSelectedReceivers((prev) => {
      const exists = prev.find((r) => r.id === user.id);
      return exists ? prev.filter((r) => r.id !== user.id) : [...prev, user];
    });
  };

  const handleCreate = () => {
    if (selectedReceivers.length === 0) return;
    const receiverIds = selectedReceivers.map((r) => r.id);
    onSend({ receiverIds });
    onClose();
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.wrapper} onClick={handleOutsideClick}>
      <div
        className={styles.modal}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <h2 className={styles.title}>New Message</h2>
        <p className={styles.subtitle}>Search and select people to chat</p>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search people..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className={styles.receiverList}>
          {filteredReceivers.map((user) => {
            const isSelected = selectedReceivers.some((r) => r.id === user.id);
            return (
              <button
                key={user.id}
                onClick={() => handleToggleReceiver(user)}
                className={
                  isSelected
                    ? "selected " + styles.receiverItem
                    : styles.receiverItem
                }
              >
                <img src={user.avatar_url} alt={user.name} />
                <span>{user.name}</span>
                {isSelected && (
                  <span className={styles.selectedText}>Selected</span>
                )}
              </button>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancel}>
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={selectedReceivers.length === 0}
            className={styles.send}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
