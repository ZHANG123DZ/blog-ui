import PropTypes from "prop-types";
import PostCard from "../PostCard/PostCard";
import Pagination from "../Pagination/Pagination";
import EmptyState from "../EmptyState/EmptyState";
import Loading from "../Loading/Loading";
import styles from "./PostList.module.scss";
import { useState } from "react";
import likeService from "@/services/like/like.service";
import { useSelector } from "react-redux";
import bookmarkService from "@/services/bookmark/bookmark.service";

const PostList = ({
  posts = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showPagination = true,
  layout = "grid",
  className,
  ...props
}) => {
  const [like, setLike] = useState(false);
  const cur_user = useSelector((state) => state.auth.currentUser);

  const handleLikeClick = async (postId) => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return;
    }

    try {
      const data = {
        like_able_id: postId,
        type: "post",
      };
      if (!like) {
        await likeService.like(data);
        setLike(true);
      } else {
        await likeService.unlike(data);
        setLike(false);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const [bookmark, setBookMark] = useState(false);
  const handleBookmarkClick = async (postId) => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return;
    }

    try {
      const data = {
        book_mark_able_id: postId,
        type: "post",
      };
      if (!bookmark) {
        await bookmarkService.bookmark(data);
        setBookMark(true);
      } else {
        await bookmarkService.unBookMark(data);
        setBookMark(false);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  if (loading) {
    return (
      <div className={`${styles.postList} ${className || ""}`} {...props}>
        <Loading size="md" text="Loading posts..." />
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className={`${styles.postList} ${className || ""}`} {...props}>
        <EmptyState
          title="No posts found"
          description="There are no posts available for this topic."
          icon="📝"
        />
      </div>
    );
  }
  return (
    <div className={`${styles.postList} ${className || ""}`} {...props}>
      <div className={`${styles.postsContainer} ${styles[layout]}`}>
        {posts.map((post) => {
          return (
            <div key={post.id || post.slug} className={styles.postItem}>
              <PostCard
                title={post.title}
                excerpt={post.description}
                author={post.author}
                publishedAt={post.published_at}
                readTime={post.reading_time}
                slug={post.slug}
                postId={Number(post.id)}
                featuredImage={post.cover_url}
                onLike={() => handleLikeClick(post.id)}
                onBookmark={() => handleBookmarkClick(post.id)}
                isLiked={like}
                isBookmarked={bookmark}
                likes={Number(post.likes) || 0}
                views={Number(post.views) || 0}
              />
            </div>
          );
        })}
      </div>

      {showPagination && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }).isRequired,
      published_at: PropTypes.string.isRequired,
      readTime: PropTypes.number,
      topic: PropTypes.string,
      slug: PropTypes.string.isRequired,
      featuredImage: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  showPagination: PropTypes.bool,
  layout: PropTypes.oneOf(["grid", "list"]),
  className: PropTypes.string,
};

export default PostList;
