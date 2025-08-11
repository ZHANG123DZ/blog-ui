import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./FeaturedPosts.module.scss";
import { useSelector } from "react-redux";

import likeService from "@/services/like/like.service";
import bookMarkService from "@/services/bookMark/bookMark.service";

const FeaturedPosts = ({
  posts = [],
  loading = false,
  title = "Featured Posts",
  showTitle = true,
  maxPosts = 3,
  className,
  ...props
}) => {
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
        await bookMarkService.bookmark(data);
      } else {
        await bookMarkService.unBookMark(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <section
        className={`${styles.featuredPosts} ${className || ""}`}
        {...props}
      >
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <Loading size="md" text="Loading featured posts..." />
      </section>
    );
  }

  if (!posts.length) {
    return (
      <section
        className={`${styles.featuredPosts} ${className || ""}`}
        {...props}
      >
        {showTitle && <h2 className={styles.title}>{title}</h2>}
        <EmptyState
          title="No featured posts"
          description="There are no featured posts available at the moment."
          icon="⭐"
        />
      </section>
    );
  }

  const displayPosts = posts.slice(0, maxPosts);

  return (
    <section
      className={`${styles.featuredPosts} ${className || ""}`}
      {...props}
    >
      {showTitle && <h2 className={styles.title}>{title}</h2>}

      <div className={styles.postsGrid}>
        {displayPosts.map((post, index) => (
          <div
            key={post.id || post.slug}
            className={`${styles.postItem} ${
              index === 0 ? styles.featured : ""
            }`}
          >
            <PostCard
              postId={Number(post.id)}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author}
              publishedAt={post.publishedAt}
              readTime={post.readTime}
              topic={post.topic}
              slug={post.slug}
              featuredImage={post.featuredImage}
              showInteractions
              showViewCount
              isLiked={post.isLiked}
              isBookmarked={post.isBookMarked}
              likes={Number(post.likes) || 0}
              views={Number(post.views) || 0}
              onLike={(postId, isLiked) => handleLikeClick(postId, isLiked)}
              onBookmark={(postId, isBookmarked) =>
                handleBookmarkClick(postId, isBookmarked)
              }
            />
          </div>
        ))}
      </div>
    </section>
  );
};

FeaturedPosts.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }).isRequired,
      publishedAt: PropTypes.string.isRequired,
      readTime: PropTypes.number,
      topic: PropTypes.string,
      slug: PropTypes.string.isRequired,
      featuredImage: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  title: PropTypes.string,
  showTitle: PropTypes.bool,
  maxPosts: PropTypes.number,
  className: PropTypes.string,
};

export default FeaturedPosts;
