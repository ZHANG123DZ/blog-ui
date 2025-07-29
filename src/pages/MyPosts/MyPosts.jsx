import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import PostCard from "../../components/PostCard/PostCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import Badge from "../../components/Badge/Badge";
import styles from "./MyPosts.module.scss";
import { useSelector } from "react-redux";
import userService from "@/services/user/user.service";
import bookmarkService from "@/services/bookmark/bookMark.service";
import likeService from "@/services/like/like.service";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - trong thực tế sẽ fetch từ API
  // const mockPosts = [
  //     {
  //         id: 1,
  //         title: "Getting Started with React Hooks",
  //         slug: "getting-started-react-hooks",
  //         excerpt:
  //             "Learn the fundamentals of React Hooks and how they can simplify your component logic.",
  //         coverImage: "https://via.placeholder.com/400x200?text=React+Hooks",
  //         readingTime: 8,
  //         publishedAt: "2024-01-15",
  //         status: "published",
  //         topics: ["React", "JavaScript"],
  //         viewsCount: 1250,
  //         likesCount: 42,
  //         commentsCount: 15,
  //     },
  //     {
  //         id: 2,
  //         title: "Advanced CSS Grid Techniques",
  //         slug: "advanced-css-grid-techniques",
  //         excerpt:
  //             "Deep dive into CSS Grid and discover advanced layout techniques for modern web development.",
  //         coverImage: "https://via.placeholder.com/400x200?text=CSS+Grid",
  //         readingTime: 12,
  //         publishedAt: "2024-01-10",
  //         status: "published",
  //         topics: ["CSS", "Web Design"],
  //         viewsCount: 890,
  //         likesCount: 28,
  //         commentsCount: 8,
  //     },
  //     {
  //         id: 3,
  //         title: "Building Scalable APIs with Node.js",
  //         slug: "building-scalable-apis-nodejs",
  //         excerpt:
  //             "Best practices for creating robust and scalable APIs using Node.js and Express.",
  //         coverImage: "https://via.placeholder.com/400x200?text=Node.js+API",
  //         readingTime: 15,
  //         publishedAt: "2024-01-05",
  //         status: "draft",
  //         topics: ["Node.js", "Backend"],
  //         viewsCount: 0,
  //         likesCount: 0,
  //         commentsCount: 0,
  //     },
  //     {
  //         id: 4,
  //         title: "Modern JavaScript ES2024 Features",
  //         slug: "modern-javascript-es2024-features",
  //         excerpt:
  //             "Explore the latest JavaScript features and how they can improve your development workflow.",
  //         coverImage:
  //             "https://via.placeholder.com/400x200?text=JavaScript+ES2024",
  //         readingTime: 10,
  //         publishedAt: "2023-12-28",
  //         status: "published",
  //         topics: ["JavaScript", "ES2024"],
  //         viewsCount: 2150,
  //         likesCount: 67,
  //         commentsCount: 23,
  //     },
  // ];
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
  useEffect(() => {
    // Simulate API call
    const fetchPosts = async () => {
      setLoading(true);
      const myPosts = await userService.getUserPosts(cur_user.username);
      setPosts(myPosts.data);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesTab = activeTab === "all" || post.status === activeTab;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      default:
        return "secondary";
    }
  };

  const tabs = [
    { key: "all", label: "All Posts", count: posts.length },
    {
      key: "published",
      label: "Published",
      count: posts.filter((p) => p.status === "published").length,
    },
    {
      key: "draft",
      label: "Drafts",
      count: posts.filter((p) => p.status === "draft").length,
    },
  ];

  if (loading) {
    return (
      <div className={styles.container}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Posts</h1>
            <p className={styles.subtitle}>
              Manage and track your published articles and drafts
            </p>
          </div>
          <div className={styles.actions}>
            <Link to="/write">
              <Button variant="primary">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 2V14M2 8H14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Write New Post
              </Button>
            </Link>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.tabs}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${
                  activeTab === tab.key ? styles.tabActive : ""
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className={styles.tabCount}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className={styles.searchContainer}>
            <div className={styles.searchInput}>
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.333 12.667A5.333 5.333 0 100 7.333a5.333 5.333 0 000 5.334zM14 14l-2.9-2.9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder="Search your posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {filteredPosts.length === 0 ? (
            <EmptyState
              title={searchTerm ? "No posts found" : "No posts yet"}
              description={
                searchTerm
                  ? "Try adjusting your search terms or filters"
                  : "Start writing your first blog post to see it here"
              }
              actionButton={
                !searchTerm && (
                  <Link to="/write">
                    <Button variant="primary">Write Your First Post</Button>
                  </Link>
                )
              }
            />
          ) : (
            <div className={styles.postsGrid}>
              {filteredPosts.map((post) => (
                <div key={post.id} className={styles.postItem}>
                  <PostCard
                    postId={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    featuredImage={post.featuredImage}
                    readTime={post.readingTime}
                    publishedAt={post.publishedAt}
                    slug={post.slug}
                    topics={post.topics}
                    author={post.author}
                    onLike={(postId, isLiked) =>
                      handleLikeClick(postId, isLiked)
                    }
                    onBookmark={(postId, isBookmarked) =>
                      handleBookmarkClick(postId, isBookmarked)
                    }
                    likes={Number(post.likes) || 0}
                    views={Number(post.views) || 0}
                  />
                  <div className={styles.postMeta}>
                    <div className={styles.postStatus}>
                      <Badge variant={getStatusBadgeVariant(post.status)}>
                        {post.status}
                      </Badge>
                    </div>
                    <div className={styles.postStats}>
                      <span className={styles.stat}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
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
                        {post.viewsCount}
                      </span>
                      <span className={styles.stat}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M14 6.5c0 4.8-5.25 7.5-6 7.5s-6-2.7-6-7.5C2 3.8 4.8 1 8 1s6 2.8 6 5.5z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {post.likesCount}
                      </span>
                      <span className={styles.stat}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M14 10c0 .6-.4 1-1 1H4l-3 3V3c0-.6.4-1 1-1h11c.6 0 1 .4 1 1v7z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {post.commentsCount}
                      </span>
                    </div>
                    <div className={styles.postActions}>
                      <Link
                        to={`/write/${post.slug}`}
                        className={styles.actionButton}
                        title="Edit post"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M11.333 2a1.885 1.885 0 012.667 2.667L4.667 14 1 14.333l.333-3.666L11.333 2z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Link>
                      {post.status === "published" && (
                        <Link
                          to={`/blog/${post.slug}`}
                          className={styles.actionButton}
                          title="View post"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M6 12l6-6-6-6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPosts;
