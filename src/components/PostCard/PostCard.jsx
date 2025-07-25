import { useState, memo, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import Badge from "../Badge/Badge";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./PostCard.module.scss";
import likeService from "@/services/like/like.service";
import { useSelector } from "react-redux";
import bookmarkService from "@/services/bookmark/bookmark.service";

const PostCard = ({
  title,
  postId,
  excerpt,
  author,
  publishedAt,
  readTime,
  topic,
  slug,
  featuredImage,
  loading = false,
  compact = false,
  className,
  // New interaction props
  likes = 0,
  views = 0,
  isLiked = false,
  isBookmarked = false,
  showViewCount = true,
  showInteractions = true,
  onLike,
  onBookmark,
  ...props
}) => {
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticBookmarked, setOptimisticBookmarked] =
    useState(isBookmarked);
  const [optimisticLikes, setOptimisticLikes] = useState(likes);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const cur_user = useSelector((state) => state.auth.currentUser);

  const checkLike = async (postId) => {
    if (!cur_user) {
      return false;
    }

    const data = {
      like_able_id: postId,
      type: "post",
    };

    try {
      const isLike = await likeService.check(data);
      return isLike.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  useEffect(() => {
    const fetchLikeState = async () => {
      const result = await checkLike(postId);
      setOptimisticLiked(result);
    };

    fetchLikeState();
  }, [cur_user]);

  const handleLike = async () => {
    if (!onLike || likingInProgress) return;

    setLikingInProgress(true);

    // Optimistic update
    setOptimisticLiked(!optimisticLiked);
    setOptimisticLikes(
      optimisticLiked ? optimisticLikes - 1 : optimisticLikes + 1
    );

    try {
      await onLike(slug, !optimisticLiked);
    } catch (error) {
      // Revert on error
      setOptimisticLiked(optimisticLiked);
      setOptimisticLikes(optimisticLikes);
      console.error("Failed to toggle like:", error);
    } finally {
      setLikingInProgress(false);
    }
  };

  const checkBookMark = async (postId) => {
    if (!cur_user) {
      return false;
    }

    const data = {
      book_mark_able_id: postId,
      type: "post",
    };

    try {
      const isBookMark = await bookmarkService.check(data);
      return isBookMark.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  useEffect(() => {
    const fetchBookMarkState = async () => {
      const result = await checkBookMark(postId);
      setOptimisticBookmarked(result);
    };

    fetchBookMarkState();
  }, [cur_user]);

  const handleBookmark = async () => {
    if (!onBookmark || bookmarkingInProgress) return;

    setBookmarkingInProgress(true);

    // Optimistic update
    setOptimisticBookmarked(!optimisticBookmarked);

    try {
      await onBookmark(slug, !optimisticBookmarked);
    } catch (error) {
      // Revert on error
      setOptimisticBookmarked(optimisticBookmarked);
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setBookmarkingInProgress(false);
    }
  };

  if (loading) {
    return (
      <Card
        className={`${styles.postCard} ${styles.loading} ${className || ""}`}
        variant="default"
        padding="none"
        {...props}
      >
        <div className={styles.skeletonImage} />
        <div className={styles.content}>
          <div className={styles.skeletonBadge} />
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonExcerpt} />
          <div className={styles.skeletonMeta} />
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`${styles.postCard} ${compact ? styles.compact : ""} ${
        className || ""
      }`}
      variant="default"
      hoverable
      padding="none"
      {...props}
    >
      {/* Featured Image */}
      <div className={styles.imageContainer}>
        <Link to={`/blog/${slug}`}>
          <FallbackImage
            src={featuredImage}
            alt={title}
            className={styles.image}
            lazy={true}
          />
        </Link>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {/* Topic Badge */}
        {topic && (
          <div className={styles.topicBadge}>
            <Badge variant="primary" size="sm">
              {topic}
            </Badge>
          </div>
        )}

        {/* Title */}
        <h3 className={styles.title}>
          <Link to={`/blog/${slug}`} className={styles.titleLink}>
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

        {/* Meta Information */}
        <div className={styles.meta}>
          <div className={styles.author}>
            {author?.avatar && (
              <FallbackImage
                src={author.avatar}
                alt={author.name}
                className={styles.authorAvatar}
                lazy={true}
              />
            )}
            <Link
              to={`/profile/${
                author?.username ||
                author?.name?.toLowerCase().replace(/\s+/g, "-")
              }`}
              className={styles.authorName}
            >
              {author?.name}
            </Link>
          </div>

          <div className={styles.metaInfo}>
            <span className={styles.date}>{formatDate(publishedAt)}</span>
            {readTime && (
              <>
                <span className={styles.separator}>•</span>
                <span className={styles.readTime}>{readTime} min read</span>
              </>
            )}
          </div>
        </div>

        {/* Interactions */}
        {showInteractions && (
          <div className={styles.interactions}>
            <div className={styles.stats}>
              {/* View Count */}
              {showViewCount && views > 0 && (
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="8"
                      cy="8"
                      r="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  {views}
                </span>
              )}

              {/* Like Count */}
              {optimisticLikes > 0 && (
                <span className={styles.stat}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M14 6.5c0 4.8-5.25 7.5-6 7.5s-6-2.7-6-7.5C2 3.8 4.8 1 8 1s6 2.8 6 5.5z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {optimisticLikes}
                </span>
              )}
            </div>

            <div className={styles.actions}>
              {/* Like Button */}
              <button
                className={`${styles.actionButton} ${
                  optimisticLiked ? styles.liked : ""
                } ${likingInProgress ? styles.loading : ""}`}
                onClick={handleLike}
                disabled={likingInProgress}
                title={optimisticLiked ? "Unlike" : "Like"}
                aria-label={`${optimisticLiked ? "Unlike" : "Like"} this post`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill={optimisticLiked ? "currentColor" : "none"}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Bookmark Button */}
              <button
                className={`${styles.actionButton} ${
                  optimisticBookmarked ? styles.bookmarked : ""
                } ${bookmarkingInProgress ? styles.loading : ""}`}
                onClick={handleBookmark}
                disabled={bookmarkingInProgress}
                title={optimisticBookmarked ? "Remove bookmark" : "Bookmark"}
                aria-label={`${
                  optimisticBookmarked ? "Remove bookmark from" : "Bookmark"
                } this post`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill={optimisticBookmarked ? "currentColor" : "none"}
                >
                  <path
                    d="M3 1C2.45 1 2 1.45 2 2V15L8 12L14 15V2C14 1.45 13.55 1 13 1H3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

PostCard.propTypes = {
  title: PropTypes.string.isRequired,
  postId: PropTypes.number.isRequired,
  excerpt: PropTypes.string,
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  publishedAt: PropTypes.string,
  readTime: PropTypes.number,
  topic: PropTypes.string,
  slug: PropTypes.string,
  featuredImage: PropTypes.string,
  loading: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string,
  // New interaction props
  likes: PropTypes.number,
  views: PropTypes.number,
  isLiked: PropTypes.bool,
  isBookmarked: PropTypes.bool,
  showViewCount: PropTypes.bool,
  showInteractions: PropTypes.bool,
  onLike: PropTypes.func,
  onBookmark: PropTypes.func,
};

export default memo(PostCard);
