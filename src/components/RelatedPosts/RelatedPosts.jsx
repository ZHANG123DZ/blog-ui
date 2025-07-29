import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import EmptyState from "../EmptyState/EmptyState";
import styles from "./RelatedPosts.module.scss";
import bookmarkService from "@/services/bookmark/bookmark.service";
import likeService from "@/services/like/like.service";
import { useState } from "react";
import { useSelector } from "react-redux";

const RelatedPosts = ({
  posts = [],
  loading = false,
  maxPosts = 3,
  className,
  ...props
}) => {
  const displayPosts = posts.slice(0, maxPosts);
  const cur_user = useSelector((state) => state.auth.currentUser);

  const handleLikeClick = async (postId, isLiked) => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return;
    }

    try {
      const data = {
        like_able_id: postId,
        type: "post",
      };

      if (!isLiked) {
        await likeService.like(data);
      } else {
        await likeService.unlike(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookmarkClick = async (postId, isBookmarked) => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return;
    }

    try {
      const data = {
        book_mark_able_id: postId,
        type: "post",
      };

      if (!isBookmarked) {
        await bookmarkService.bookmark(data);
      } else {
        await bookmarkService.unBookMark(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <section
        className={`${styles.relatedPosts} ${className || ""}`}
        {...props}
      >
        <h2 className={styles.title}>Related Posts</h2>
        <div className={styles.grid}>
          {Array.from({ length: maxPosts }, (_, index) => (
            <PostCard key={index} loading />
          ))}
        </div>
      </section>
    );
  }

  if (displayPosts.length === 0) {
    return (
      <section
        className={`${styles.relatedPosts} ${className || ""}`}
        {...props}
      >
        <h2 className={styles.title}>Related Posts</h2>
        <EmptyState
          icon="📰"
          title="No related posts"
          description="Check back later for more content on this topic."
        />
      </section>
    );
  }

  return (
    <section className={`${styles.relatedPosts} ${className || ""}`} {...props}>
      <h2 className={styles.title}>Related Posts</h2>
      <div className={styles.grid}>
        {displayPosts.map((post) => (
          <PostCard
            key={post.id}
            postId={Number(post.id) || 0}
            {...post}
            compact
            likes={Number(post.likes) || 0}
            views={Number(post.views) || 0}
            onLike={(postId, isLiked) => handleLikeClick(postId, isLiked)}
            onBookmark={(postId, isBookmarked) =>
              handleBookmarkClick(postId, isBookmarked)
            }
          />
        ))}
      </div>
    </section>
  );
};

RelatedPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      featuredImage: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }),
      publishedAt: PropTypes.string.isRequired,
      readTime: PropTypes.number,
      topic: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  maxPosts: PropTypes.number,
  className: PropTypes.string,
};

export default RelatedPosts;
