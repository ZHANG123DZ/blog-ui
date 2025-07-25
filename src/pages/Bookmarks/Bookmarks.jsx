import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PostCard from "../../components/PostCard/PostCard";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import Badge from "../../components/Badge/Badge";
import Button from "../../components/Button/Button";
import styles from "./Bookmarks.module.scss";
import bookmarkService from "@/services/bookmark/bookmark.service";
import { useSelector } from "react-redux";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("all");

  const currentUser = useSelector((state) => state.auth.currentUser);

  // Mock bookmarked posts data
  //   const mockBookmarks = [
  //     {
  //       id: 1,
  //       title: "Advanced React Patterns and Best Practices",
  //       slug: "advanced-react-patterns-best-practices",
  //       excerpt:
  //         "Explore advanced React patterns including render props, compound components, and custom hooks for building scalable applications.",
  //       coverImage: "https://via.placeholder.com/400x200?text=React+Patterns",
  //       readingTime: 12,
  //       publishedAt: "2024-01-18",
  //       bookmarkedAt: "2024-01-20",
  //       topics: ["React", "JavaScript", "Frontend"],
  //       author: {
  //         name: "Sarah Johnson",
  //         username: "sarah-dev",
  //         avatar: "https://via.placeholder.com/32?text=SJ",
  //       },
  //       viewsCount: 2340,
  //       likesCount: 89,
  //       commentsCount: 23,
  //     },
  //     {
  //       id: 2,
  //       title: "Building Scalable Node.js APIs with Express",
  //       slug: "building-scalable-nodejs-apis-express",
  //       excerpt:
  //         "Learn how to build robust and scalable APIs using Node.js, Express, and modern architectural patterns.",
  //       coverImage: "https://via.placeholder.com/400x200?text=Node.js+API",
  //       readingTime: 15,
  //       publishedAt: "2024-01-15",
  //       bookmarkedAt: "2024-01-19",
  //       topics: ["Node.js", "Backend", "API"],
  //       author: {
  //         name: "Michael Chen",
  //         username: "mike-dev",
  //         avatar: "https://via.placeholder.com/32?text=MC",
  //       },
  //       viewsCount: 1890,
  //       likesCount: 67,
  //       commentsCount: 19,
  //     },
  //     {
  //       id: 3,
  //       title: "Modern CSS Grid and Flexbox Techniques",
  //       slug: "modern-css-grid-flexbox-techniques",
  //       excerpt:
  //         "Master CSS Grid and Flexbox to create responsive and modern web layouts with practical examples.",
  //       coverImage: "https://via.placeholder.com/400x200?text=CSS+Grid",
  //       readingTime: 10,
  //       publishedAt: "2024-01-12",
  //       bookmarkedAt: "2024-01-18",
  //       topics: ["CSS", "Web Design", "Frontend"],
  //       author: {
  //         name: "Emily Rodriguez",
  //         username: "emily-css",
  //         avatar: "https://via.placeholder.com/32?text=ER",
  //       },
  //       viewsCount: 1456,
  //       likesCount: 52,
  //       commentsCount: 11,
  //     },
  //     {
  //       id: 4,
  //       title: "TypeScript for JavaScript Developers",
  //       slug: "typescript-javascript-developers",
  //       excerpt:
  //         "A comprehensive guide to TypeScript for developers coming from JavaScript, covering types, interfaces, and best practices.",
  //       coverImage: "https://via.placeholder.com/400x200?text=TypeScript",
  //       readingTime: 18,
  //       publishedAt: "2024-01-08",
  //       bookmarkedAt: "2024-01-16",
  //       topics: ["TypeScript", "JavaScript", "Development"],
  //       author: {
  //         name: "David Kim",
  //         username: "david-ts",
  //         avatar: "https://via.placeholder.com/32?text=DK",
  //       },
  //       viewsCount: 3210,
  //       likesCount: 124,
  //       commentsCount: 45,
  //     },
  //     {
  //       id: 5,
  //       title: "Docker and Containerization for Beginners",
  //       slug: "docker-containerization-beginners",
  //       excerpt:
  //         "Get started with Docker and learn how to containerize your applications for better deployment and scalability.",
  //       coverImage: "https://via.placeholder.com/400x200?text=Docker",
  //       readingTime: 14,
  //       publishedAt: "2024-01-05",
  //       bookmarkedAt: "2024-01-14",
  //       topics: ["Docker", "DevOps", "Deployment"],
  //       author: {
  //         name: "Alex Thompson",
  //         username: "alex-devops",
  //         avatar: "https://via.placeholder.com/32?text=AT",
  //       },
  //       viewsCount: 2156,
  //       likesCount: 78,
  //       commentsCount: 31,
  //     },
  //   ];

  useEffect(() => {
    // Simulate API call
    const fetchBookmarks = async () => {
      setLoading(true);
      const mockBookmarks = await bookmarkService.getBookMarkedUserId({
        userId: currentUser.id,
        type: "post",
      });
      setBookmarks(mockBookmarks.data.bookMarks);
      setLoading(false);
    };

    fetchBookmarks();
  }, []);

  // Get all unique topics from bookmarks
  const availableTopics = [
    ...new Set(bookmarks.flatMap((bookmark) => bookmark.topics)),
  ].sort();

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.author.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTopic =
      selectedTopic === "all" || bookmark.topics.includes(selectedTopic);

    return matchesSearch && matchesTopic;
  });

  const handleRemoveBookmark = async (bookmarkId) => {
    await bookmarkService.unBookMark({
      type: "post",
      book_mark_able_id: bookmarkId,
      user_id: currentUser.id,
    });
    setBookmarks((prev) =>
      prev.filter((bookmark) => bookmark.id !== bookmarkId)
    );
  };

  const handleClearAllBookmarks = async () => {
    const bookMarkSelected = bookmarks.filter((bookmark) => {
      if (selectedTopic === "all") return bookmark;
      return bookmark.topics.includes(selectedTopic);
    });

    if (window.confirm("Are you sure you want to remove all bookmarks?")) {
      setBookmarks([]);
      bookMarkSelected.forEach(async (bookmark) => {
        await bookmarkService.unBookMark({
          type: "post",
          book_mark_able_id: bookmark.id,
          user_id: currentUser.id,
        });
      });
    }
  };

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
            <h1 className={styles.title}>My Bookmarks</h1>
            <p className={styles.subtitle}>
              {bookmarks.length} saved{" "}
              {bookmarks.length === 1 ? "article" : "articles"}
            </p>
          </div>
          {bookmarks.length > 0 && (
            <div className={styles.actions}>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClearAllBookmarks}
              >
                Clear All
              </Button>
            </div>
          )}
        </div>

        {bookmarks.length > 0 && (
          <div className={styles.controls}>
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
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.filterContainer}>
              <label className={styles.filterLabel}>Filter by topic:</label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className={styles.topicFilter}
              >
                <option value="all">All Topics</option>
                {availableTopics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className={styles.content}>
          {filteredBookmarks.length === 0 ? (
            <EmptyState
              title={
                bookmarks.length === 0
                  ? "No bookmarks yet"
                  : searchTerm || selectedTopic !== "all"
                  ? "No bookmarks found"
                  : "No bookmarks"
              }
              description={
                bookmarks.length === 0
                  ? "Start bookmarking articles you want to read later"
                  : "Try adjusting your search terms or filters"
              }
              //   actionText={
              //     bookmarks.length === 0 && (
              //       <Link to="/">
              //         <Button variant="primary">Explore Articles</Button>
              //       </Link>
              //     )
              //   }
            />
          ) : (
            <div className={styles.bookmarksGrid}>
              {filteredBookmarks.map((bookmark) => (
                <div key={bookmark.id} className={styles.bookmarkItem}>
                  <PostCard
                    postId={bookmark.id}
                    title={bookmark.title}
                    excerpt={bookmark.excerpt}
                    featuredImage={bookmark.featuredImage}
                    readTime={bookmark.readingTime}
                    publishedAt={bookmark.publishedAt}
                    slug={bookmark.slug}
                    topics={bookmark.topics}
                    author={bookmark.author}
                  />
                  <div className={styles.bookmarkMeta}>
                    <div className={styles.bookmarkInfo}>
                      <span className={styles.bookmarkedDate}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M3 1C2.45 1 2 1.45 2 2V15L8 12L14 15V2C14 1.45 13.55 1 13 1H3Z"
                            fill="currentColor"
                          />
                        </svg>
                        Saved{" "}
                        {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                      </span>
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
                          {bookmark.viewsCount}
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
                          {bookmark.likesCount}
                        </span>
                      </div>
                    </div>
                    <div className={styles.bookmarkActions}>
                      <Link
                        to={`/blog/${bookmark.slug}`}
                        className={styles.actionButton}
                        title="Read article"
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
                      <button
                        onClick={() => handleRemoveBookmark(bookmark.id)}
                        className={`${styles.actionButton} ${styles.removeButton}`}
                        title="Remove bookmark"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M12 4L4 12M4 4l8 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {filteredBookmarks.length > 0 && (
          <div className={styles.resultsInfo}>
            <p className={styles.resultsText}>
              Showing {filteredBookmarks.length} of {bookmarks.length} bookmarks
              {selectedTopic !== "all" && (
                <Badge variant="secondary" className={styles.activeTopic}>
                  {selectedTopic}
                  <button
                    onClick={() => setSelectedTopic("all")}
                    className={styles.clearFilter}
                  >
                    ×
                  </button>
                </Badge>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
