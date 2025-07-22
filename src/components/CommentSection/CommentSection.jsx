import { useState } from "react";
import PropTypes from "prop-types";
import CommentItem from "../CommentItem/CommentItem";
import Button from "../Button/Button";
import Input from "../Input/Input";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./CommentSection.module.scss";

const CommentSection = ({
  comments = [],
  loading = false,
  onAddComment,
  onReplyComment,
  onLikeComment,
  onEditComment,
  onDeleteComment,
  isAuthenticated = false,
  className,
  ...props
}) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onAddComment) {
        await onAddComment(newComment.trim());
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId, content) => {
    if (onReplyComment) {
      try {
        await onReplyComment(parentId, content);
      } catch (error) {
        console.error("Failed to reply to comment:", error);
      }
    }
  };

  if (loading) {
    return (
      <section
        className={`${styles.commentSection} ${className || ""}`}
        {...props}
      >
        <h2 className={styles.title}>Comments</h2>
        <div className={styles.skeleton}>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className={styles.skeletonComment}>
              <div className={styles.skeletonAvatar} />
              <div className={styles.skeletonContent}>
                <div className={styles.skeletonHeader} />
                <div className={styles.skeletonText} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`${styles.commentSection} ${className || ""}`}
      {...props}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>Comments ({comments.length})</h2>
      </div>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form className={styles.commentForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className={styles.commentInput}
              rows="4"
              required
            />
          </div>
          <div className={styles.formActions}>
            <div className={styles.guidelines}>
              <span>Be respectful and constructive in your comments.</span>
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!newComment.trim() || isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <div className={styles.loginPrompt}>
          <p>
            Please <a href="/login">sign in</a> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className={styles.commentsList}>
        {comments.length === 0 ? (
          <EmptyState
            icon="💬"
            title="No comments yet"
            description="Be the first to share your thoughts!"
          />
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={isAuthenticated ? handleReply : undefined}
              onLike={isAuthenticated ? onLikeComment : undefined}
              onEdit={isAuthenticated ? onEditComment : undefined}
              onDelete={isAuthenticated ? onDeleteComment : undefined}
              showActions={isAuthenticated}
              maxLevel={2}
            />
          ))
        )}
      </div>

      {/* Load More */}
      {comments.length > 0 && comments.length % 10 === 0 && (
        <div className={styles.loadMore}>
          <Button variant="ghost" size="lg">
            Load More Comments
          </Button>
        </div>
      )}
    </section>
  );
};

CommentSection.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string.isRequired,
      }).isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      likes: PropTypes.number,
      isLiked: PropTypes.bool,
      replies: PropTypes.array,
      isEdited: PropTypes.bool,
    })
  ),
  loading: PropTypes.bool,
  onAddComment: PropTypes.func,
  onReplyComment: PropTypes.func,
  onLikeComment: PropTypes.func,
  onEditComment: PropTypes.func,
  onDeleteComment: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  className: PropTypes.string,
};

export default CommentSection;
