import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  BlogContent,
  AuthorInfo,
  RelatedPosts,
  CommentSection,
  Loading,
} from "../../components";
import styles from "./BlogDetail.module.scss";
import { useSelector } from "react-redux";
import postService from "@/services/posts/post.service";
import commentService from "@/services/comment/comment.service";
import bookmarkService from "@/services/bookmark/bookmark.service";
import likeService from "@/services/like/like.service";
import findCommentById from "@/function/findCommentById";
import randomArray from "@/utils/randomArray";
import socketClient from "@/configs/socketClient";

const BlogDetail = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const [isAuthenticated] = useState(isAuth); // Mock authentication

  // Like and bookmark states
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [views, setViews] = useState(0);
  const [totalComment, setToTalComment] = useState(0);
  const [likingInProgress, setLikingInProgress] = useState(false);
  const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const cur_user = useSelector((state) => state.auth.currentUser);
  //Featch dữ liệu của post và comments
  useEffect(() => {
    // Simulate API call
    const loadPost = async () => {
      setLoading(true);
      try {
        // Simulate loading delay
        const post = await postService.getPost(slug);
        const postData = post.data;
        const topics = postData.topics;
        const relatedPosts = await postService.getRelatedPost(topics);

        const randomPost = randomArray(relatedPosts.data);
        setPost(postData);
        setRelatedPosts(randomPost);
        setIsPublished(
          postData.status === "published" &&
            new Date(postData.published_at) <= new Date()
        );
        setViews(Number(postData.views));
        setLikes(Number(postData.likes));
        const commentsData = await commentService.getCommentsByPostId(
          postData.slug
        );
        setToTalComment(commentsData.data.total);
        setComments(commentsData.data.comments);
      } catch (error) {
        console.error("Failed to load post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  //Views
  useEffect(() => {
    if (!post || !post?.id) return;
    console.log(post.slug);
    const readTimeMs = (Number(post.readTime) || 1) * 60 * 1000;
    const timer = setTimeout(() => {
      postService.updatePost(post.slug, {
        view_count: Number(post.view_count) + 1,
      });
      setViews((prev) => prev + 1);
    }, readTimeMs / 5);

    return () => clearTimeout(timer);
  }, [post, post?.id]);

  //xử lý check like của bài post
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
      const result = await checkLike(post?.id);
      setIsLiked(result);
    };

    fetchLikeState();
  }, [cur_user, post]);

  //xử lý check book mark của bài post
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
      const result = await checkBookMark(post?.id);
      setIsBookmarked(result);
    };

    fetchBookMarkState();
  }, [cur_user, post]);

  //Like post
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
      if (!isLiked) {
        await likeService.like(data);
        setIsLiked(true);
        return true;
      } else {
        await likeService.unlike(data);
        setIsLiked(false);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  //Book mark bài post
  const handleBookmarkClick = async (postId) => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return false;
    }

    try {
      const data = {
        book_mark_able_id: postId,
        type: "post",
      };
      if (!isBookmarked) {
        await bookmarkService.bookmark(data);
        setIsBookmarked(true);
        return true;
      } else {
        await bookmarkService.unBookMark(data);
        setIsBookmarked(false);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const addReplyToComments = (comments, parentId, newReply) => {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: addReplyToComments(comment.replies, parentId, newReply),
        };
      }
      return comment;
    });
  };

  // setComments((prev) => updateCommentRecursively(prev));

  useEffect(() => {
    if (!post?.id) return;

    const pusher = socketClient;

    const channel = pusher.subscribe(`post-${post.id}-comments`);
    channel.bind("new-comment", (newComment) => {
      if (newComment.parent_id === null) {
        setComments((prev) => [newComment, ...prev]);
      } else {
        setComments((prev) =>
          addReplyToComments(prev, newComment.parent_id, newComment)
        );
      }
    });
    channel.bind("updated-comment", (editComment) => {
      const updateCommentRecursively = (comments) => {
        return comments.map((comment) => {
          if (comment.id === editComment.id) {
            return {
              ...comment,
              content: editComment.content,
              isEdited: true,
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateCommentRecursively(comment.replies),
            };
          }
          return comment;
        });
      };
      setComments((prev) =>
        updateCommentRecursively(prev, editComment.id, editComment.content)
      );
    });
    channel.bind("delete-comment", (commentId) => {
      const deleteCommentRecursively = (comments) => {
        return comments
          .filter((comment) => Number(comment.id) !== Number(commentId))
          .map((comment) => {
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: deleteCommentRecursively(comment.replies),
              };
            }
            return comment;
          });
      };
      setComments((prev) => deleteCommentRecursively(prev));
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [post?.id]);

  const handleAddComment = async (content) => {
    // Simulate API call
    const data = {
      content,
      like_count: 0,
      parent_id: null,
      user_id: cur_user?.id,
      post_id: post.id,
    };
    await commentService.createComment(post.id, data);
    // const newComment = {
    //   id: Date.now(),
    //   author: {
    //     name: "You",
    //     avatar:
    //       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    //   },
    //   content,
    //   createdAt: new Date().toISOString(),
    //   likes: 0,
    //   isLiked: false,
    //   replies: [],
    // };
    setToTalComment((prev) => prev + 1);
  };

  const handleReplyComment = async (parentId, content) => {
    const data = {
      content,
      like_count: 0,
      parent_id: parentId,
      user_id: cur_user?.id,
      post_id: post.id,
    };

    await commentService.createComment(post.id, data);
    setToTalComment((prev) => prev + 1);
  };

  const handleLikeComment = async (commentId, isLiked) => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return;
    }

    const comment = findCommentById(comments, commentId);
    if (!comment) return;

    const data = {
      like_able_id: commentId,
      type: "comment",
    };

    try {
      if (!isLiked) {
        await likeService.like(data);
      } else {
        await likeService.unlike(data);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      // Simulate API call
      await commentService.updateComment(slug, commentId, {
        content: newContent,
      });
    } catch (error) {
      console.error("Failed to edit comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Simulate API call
      await commentService.deleteComment(slug, commentId);
      setToTalComment((prev) => prev - 1);
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLikePost = async () => {
    if (likingInProgress) return;

    try {
      // Simulate API call
      const res = await handleLikeClick(post.id);
      if (!res) return;
      setLikingInProgress(true);

      // Optimistic update
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikes(likes);
      console.error("Failed to toggle like:", error);
    } finally {
      setLikingInProgress(false);
    }
  };

  const handleBookmarkPost = async () => {
    if (bookmarkingInProgress) return;

    try {
      // Simulate API call
      const res = await handleBookmarkClick(post.id);
      if (!res) return;
      setBookmarkingInProgress(true);

      // Optimistic update
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      // Revert on error
      setIsBookmarked(isBookmarked);
    } finally {
      setBookmarkingInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading size="md" text="Loading article..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Article not found</h1>
        <p>
          The article you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Article Header with Interactions */}
      <div className={styles.articleHeader}>
        <BlogContent {...post} />

        {/* Post Interactions - Moved to top for better UX */}
        {post.status !== "draft" && (
          <div className={styles.interactions}>
            {/* Stats */}
            <div className={styles.stats}>
              {/* Views */}
              <div className={styles.stat}>
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="8" cy="8" r="2" />
                </svg>
                <span>{views} views</span>
              </div>

              {/* Likes */}
              <div className={styles.stat}>
                <svg viewBox="0 0 16 16" fill="none">
                  <path
                    d="M14 6.5c0 4.8-5.25 7.5-6 7.5s-6-2.7-6-7.5C2 3.8 4.8 1 8 1s6 2.8 6 5.5z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{likes} likes</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actions}>
              {/* Like Button */}
              <button
                className={`${styles.actionButton} ${
                  isLiked ? styles.liked : ""
                } ${likingInProgress ? styles.loading : ""}`}
                onClick={handleLikePost}
                disabled={likingInProgress}
                title={isLiked ? "Unlike" : "Like"}
                aria-label={`${isLiked ? "Unlike" : "Like"} this post`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill={isLiked ? "currentColor" : "none"}
                >
                  <path
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isLiked ? "Liked" : "Like"}
              </button>

              {/* Bookmark Button */}
              <button
                className={`${styles.actionButton} ${
                  isBookmarked ? styles.bookmarked : ""
                } ${bookmarkingInProgress ? styles.loading : ""}`}
                onClick={handleBookmarkPost}
                disabled={bookmarkingInProgress}
                title={isBookmarked ? "Remove bookmark" : "Bookmark"}
                aria-label={`${
                  isBookmarked ? "Remove bookmark from" : "Bookmark"
                } this post`}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill={isBookmarked ? "currentColor" : "none"}
                >
                  <path
                    d="M3 1C2.45 1 2 1.45 2 2V15L8 12L14 15V2C14 1.45 13.55 1 13 1H3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isBookmarked ? "Bookmarked" : "Bookmark"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Author Info */}
      <div className={styles.authorSection}>
        <AuthorInfo author={post.author} />
      </div>

      {/* Related Posts */}
      {isPublished && (
        <div className={styles.contentSection}>
          <RelatedPosts posts={relatedPosts} />
        </div>
      )}

      {/* Comments */}
      {isPublished && (
        <div className={styles.contentSection}>
          <CommentSection
            comments={comments}
            totalComment={totalComment}
            onAddComment={handleAddComment}
            onReplyComment={handleReplyComment}
            onLikeComment={handleLikeComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
            isAuthenticated={isAuthenticated}
          />
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
