import { useState, useEffect, useRef } from "react";
import styles from "./InvitationMessageModal.module.scss";
import userService from "@/services/user/user.service";
import InfiniteScroll from "react-infinite-scroll-component";

export default function InvitationMessageModal({ isOpen, onClose, onSend }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredReceivers, setFilteredReceivers] = useState([]);
  const [selectedReceivers, setSelectedReceivers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const timeoutRef = useRef(null);
  const modalRef = useRef(null);

  // Load users page đầu hoặc load thêm page
  const loadUsers = async (pageToLoad) => {
    const users = await userService.getUsers(pageToLoad, 20);
    // Cập nhật allUsers (nối thêm)
    setAllUsers((prev) => [...prev, ...users.data]);
    setTotalUsers(users.pagination.total);

    // Cập nhật hasMore dựa vào tổng số user và số đã load
    setHasMore(allUsers.length + users.data.length < users.pagination.total);
  };

  // Load page đầu khi mở modal hoặc reset search term
  useEffect(() => {
    if (!isOpen) return;
    setAllUsers([]);
    setFilteredReceivers([]);
    setSelectedReceivers([]);
    setPage(1);
    setHasMore(true);
    setSearchTerm("");
    loadUsers(1);
  }, [isOpen]);

  // Khi page tăng thì load thêm data
  useEffect(() => {
    if (page === 1) return; // page 1 đã load trong effect trên
    loadUsers(page);
  }, [page]);

  // Debounce search
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      const keyword = searchTerm.toLowerCase().trim();
      if (!keyword) {
        // Nếu search rỗng thì hiển thị tất cả đã load
        setFilteredReceivers(allUsers);
      } else {
        // Lọc từ tất cả user đã load
        setFilteredReceivers(
          allUsers.filter((user) =>
            user.full_name.toLowerCase().includes(keyword)
          )
        );
      }
    }, 800);

    return () => clearTimeout(timeoutRef.current);
  }, [searchTerm, allUsers]);

  const fetchMoreData = () => {
    if (hasMore) {
      setPage((p) => p + 1);
    }
  };

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

        <div
          id="scrollableDiv"
          className={styles.receiverList}
          style={{ height: 400, overflow: "auto" }} // Chiều cao scroll, bắt buộc để InfiniteScroll hoạt động tốt
        >
          <InfiniteScroll
            dataLength={filteredReceivers.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>Không còn dữ liệu</p>}
            scrollableTarget="scrollableDiv"
          >
            {filteredReceivers.map((user) => {
              const isSelected = selectedReceivers.some(
                (r) => r.id === user.id
              );
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
                  <img src={user.avatar_url} alt={user.full_name} />
                  <span>{user.full_name}</span>
                  {isSelected && (
                    <span className={styles.selectedText}>Selected</span>
                  )}
                </button>
              );
            })}
          </InfiniteScroll>
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
