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

// Mock data for demonstration
const mockBlogPost = {
    id: 1,
    title: "Understanding React Hooks: A Comprehensive Guide",
    content: `
    <p>React Hooks have revolutionized the way we write React components. They allow us to use state and other React features without writing a class component.</p>
    
    <h2>What are React Hooks?</h2>
    <p>Hooks are functions that let you "hook into" React state and lifecycle features from function components. They don't work inside classes — they let you use React without classes.</p>
    
    <h3>The most commonly used hooks include:</h3>
    <ul>
      <li><strong>useState</strong> - For adding state to functional components</li>
      <li><strong>useEffect</strong> - For performing side effects</li>
      <li><strong>useContext</strong> - For consuming context values</li>
      <li><strong>useReducer</strong> - For complex state management</li>
      <li><strong>useMemo</strong> - For memoizing expensive calculations</li>
      <li><strong>useCallback</strong> - For memoizing functions</li>
    </ul>
    
    <h2>useState Hook</h2>
    <p>The useState hook is the most basic hook. It allows you to add state to functional components:</p>
    
    <pre><code>import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    &lt;div&gt;
      &lt;p&gt;You clicked {count} times&lt;/p&gt;
      &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
        Click me
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>
    
    <h2>useEffect Hook</h2>
    <p>The useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined in React classes.</p>
    
    <blockquote>
      <p>Remember: React will run the effects after every render — including the first render.</p>
    </blockquote>
    
    <h2>Best Practices</h2>
    <p>When using React Hooks, keep these best practices in mind:</p>
    <ul>
      <li>Only call hooks at the top level of your React function</li>
      <li>Don't call hooks inside loops, conditions, or nested functions</li>
      <li>Use the ESLint plugin for hooks to catch mistakes</li>
      <li>Extract custom hooks for reusable logic</li>
    </ul>
    
    <p>React Hooks provide a more direct API to the React concepts you already know. They offer a powerful and expressive way to write React components while keeping them simple and easy to understand.</p>
  `,
    author: {
        name: "John Smith",
        title: "Senior Frontend Developer",
        bio: "Passionate about React, JavaScript, and modern web development. I love sharing knowledge and helping developers build amazing user experiences.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        social: {
            twitter: "https://twitter.com/johnsmith",
            github: "https://github.com/johnsmith",
            linkedin: "https://linkedin.com/in/johnsmith",
            website: "https://johnsmith.dev",
        },
        postsCount: 24,
        followers: 1250,
        following: 180,
    },
    publishedAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
    readTime: 8,
    topic: "React",
    tags: ["React", "JavaScript", "Frontend", "Hooks", "Web Development"],
    featuredImage:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
};

const mockRelatedPosts = [
    {
        id: 2,
        title: "Advanced React Patterns You Should Know",
        excerpt:
            "Explore advanced React patterns including render props, higher-order components, and compound components.",
        featuredImage:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
        author: {
            name: "Sarah Wilson",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-01-12T09:15:00Z",
        readTime: 12,
        topic: "React",
    },
    {
        id: 3,
        title: "State Management in React: Context vs Redux",
        excerpt:
            "Compare different state management solutions and learn when to use each approach in your React applications.",
        featuredImage:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop",
        author: {
            name: "Mike Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-01-10T16:45:00Z",
        readTime: 10,
        topic: "React",
    },
    {
        id: 4,
        title: "Building Responsive Components with CSS-in-JS",
        excerpt:
            "Learn how to create responsive and maintainable React components using modern CSS-in-JS libraries.",
        featuredImage:
            "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop",
        author: {
            name: "Emily Davis",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        },
        publishedAt: "2024-01-08T11:20:00Z",
        readTime: 7,
        topic: "CSS",
    },
];

const mockComments = [
    {
        id: 1,
        author: {
            name: "Alex Rodriguez",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        },
        content:
            "Great article! I've been using React Hooks for a while now, and this guide really helps clarify some of the more advanced concepts. The useState examples are particularly helpful for beginners.",
        createdAt: "2024-01-15T14:30:00Z",
        likes: 12,
        isLiked: false,
        replies: [
            {
                id: 2,
                author: {
                    name: "John Smith",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                },
                content:
                    "Thank you! I'm glad you found it helpful. I'll be writing more about advanced hook patterns soon.",
                createdAt: "2024-01-15T15:45:00Z",
                likes: 5,
                isLiked: true,
                replies: [],
            },
        ],
    },
    {
        id: 3,
        author: {
            name: "Lisa Park",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        },
        content:
            "Could you write a follow-up article about custom hooks? I'm still struggling with when and how to create them effectively.",
        createdAt: "2024-01-15T16:20:00Z",
        likes: 8,
        isLiked: false,
        replies: [],
    },
    {
        id: 4,
        author: {
            name: "David Kim",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
        content:
            "The useEffect explanation is spot on. I wish I had this guide when I was first learning React Hooks. The best practices section is golden!",
        createdAt: "2024-01-15T18:10:00Z",
        likes: 15,
        isLiked: true,
        replies: [],
    },
];

const BlogDetail = () => {
    const { slug } = useParams();
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [isAuthenticated] = useState(true); // Mock authentication

    // Like and bookmark states
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likes, setLikes] = useState(45); // Mock initial likes
    const [views] = useState(892); // Mock views
    const [likingInProgress, setLikingInProgress] = useState(false);
    const [bookmarkingInProgress, setBookmarkingInProgress] = useState(false);

    useEffect(() => {
        // Simulate API call
        const loadPost = async () => {
            setLoading(true);
            try {
                // Simulate loading delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                setPost(mockBlogPost);
                setRelatedPosts(mockRelatedPosts);
                setComments(mockComments);
            } catch (error) {
                console.error("Failed to load post:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [slug]);

    const handleAddComment = async (content) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newComment = {
            id: Date.now(),
            author: {
                name: "You",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
            },
            content,
            createdAt: new Date().toISOString(),
            likes: 0,
            isLiked: false,
            replies: [],
        };

        setComments((prev) => [newComment, ...prev]);
    };

    const handleReplyComment = async (parentId, content) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newReply = {
            id: Date.now(),
            author: {
                name: "You",
                avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
            },
            content,
            createdAt: new Date().toISOString(),
            likes: 0,
            isLiked: false,
            replies: [],
        };

        setComments((prev) =>
            prev.map((comment) =>
                comment.id === parentId
                    ? { ...comment, replies: [...comment.replies, newReply] }
                    : comment
            )
        );
    };

    const handleLikeComment = async (commentId) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 200));

        setComments((prev) =>
            prev.map((comment) =>
                comment.id === commentId
                    ? {
                          ...comment,
                          isLiked: !comment.isLiked,
                          likes: comment.isLiked
                              ? comment.likes - 1
                              : comment.likes + 1,
                      }
                    : comment
            )
        );
    };

    const handleEditComment = async (commentId, newContent) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const updateCommentRecursively = (comments) => {
                return comments.map((comment) => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            content: newContent,
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

            setComments((prev) => updateCommentRecursively(prev));
            console.log("Comment edited:", commentId, newContent);
        } catch (error) {
            console.error("Failed to edit comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const deleteCommentRecursively = (comments) => {
                return comments
                    .filter((comment) => comment.id !== commentId)
                    .map((comment) => {
                        if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: deleteCommentRecursively(
                                    comment.replies
                                ),
                            };
                        }
                        return comment;
                    });
            };

            setComments((prev) => deleteCommentRecursively(prev));

            console.log("Comment deleted:", commentId);
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const handleLikePost = async () => {
        if (likingInProgress) return;

        setLikingInProgress(true);

        // Optimistic update
        setIsLiked(!isLiked);
        setLikes(isLiked ? likes - 1 : likes + 1);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("Post like toggled:", !isLiked);
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

        setBookmarkingInProgress(true);

        // Optimistic update
        setIsBookmarked(!isBookmarked);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log("Post bookmark toggled:", !isBookmarked);
        } catch (error) {
            // Revert on error
            setIsBookmarked(isBookmarked);
            console.error("Failed to toggle bookmark:", error);
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
                    The article you&apos;re looking for doesn&apos;t exist or
                    has been removed.
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
                            aria-label={`${
                                isLiked ? "Unlike" : "Like"
                            } this post`}
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
                            title={
                                isBookmarked ? "Remove bookmark" : "Bookmark"
                            }
                            aria-label={`${
                                isBookmarked
                                    ? "Remove bookmark from"
                                    : "Bookmark"
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
            </div>

            {/* Author Info */}
            <div className={styles.authorSection}>
                <AuthorInfo author={post.author} />
            </div>

            {/* Related Posts */}
            <div className={styles.contentSection}>
                <RelatedPosts posts={relatedPosts} />
            </div>

            {/* Comments */}
            <div className={styles.contentSection}>
                <CommentSection
                    comments={comments}
                    onAddComment={handleAddComment}
                    onReplyComment={handleReplyComment}
                    onLikeComment={handleLikeComment}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    isAuthenticated={isAuthenticated}
                />
            </div>
        </div>
    );
};

export default BlogDetail;
