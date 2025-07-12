import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import TopicHeader from "../../components/TopicHeader/TopicHeader";
import PostList from "../../components/PostList/PostList";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import styles from "./Topic.module.scss";

const Topic = () => {
    const { slug } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    // States
    const [topic, setTopic] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Pagination
    const currentPage = parseInt(searchParams.get("page")) || 1;
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 10;

    // Mock data - replace with actual API calls
    const mockTopics = {
        javascript: {
            id: 1,
            name: "JavaScript",
            slug: "javascript",
            description:
                "Everything about JavaScript programming language, frameworks, and best practices.",
            icon: "🚀",
            postCount: 45,
            createdAt: "2023-01-15",
        },
        react: {
            id: 2,
            name: "React",
            slug: "react",
            description:
                "React.js tutorials, tips, and advanced patterns for building modern web applications.",
            icon: "⚛️",
            postCount: 32,
            createdAt: "2023-02-10",
        },
        nodejs: {
            id: 3,
            name: "Node.js",
            slug: "nodejs",
            description:
                "Server-side JavaScript development with Node.js and its ecosystem.",
            icon: "🟢",
            postCount: 28,
            createdAt: "2023-01-20",
        },
        css: {
            id: 4,
            name: "CSS",
            slug: "css",
            description:
                "Modern CSS techniques, animations, and responsive design patterns.",
            icon: "🎨",
            postCount: 23,
            createdAt: "2023-03-05",
        },
    };

    const generateMockPosts = (topicName, page = 1) => {
        const posts = [];
        const startIndex = (page - 1) * postsPerPage;

        for (let i = 1; i <= postsPerPage; i++) {
            const postIndex = startIndex + i;
            posts.push({
                id: `${slug}-${postIndex}`,
                title: `${topicName} Tutorial ${postIndex}: Advanced Concepts and Best Practices`,
                excerpt: `Learn advanced ${topicName} concepts in this comprehensive tutorial. We'll cover important topics, best practices, and real-world examples that will help you become a better developer.`,
                slug: `${slug}-tutorial-${postIndex}`,
                author: {
                    name: "John Doe",
                    avatar: `https://via.placeholder.com/32?text=JD`,
                },
                publishedAt: new Date(2024, 0, postIndex).toISOString(),
                readTime: Math.floor(Math.random() * 10) + 3,
                topic: topicName,
                featuredImage: `https://via.placeholder.com/400x200?text=${topicName}+${postIndex}`,
            });
        }

        return posts;
    };

    // Fetch topic data
    useEffect(() => {
        const fetchTopic = async () => {
            setLoading(true);
            setError(null);

            try {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 500));

                const topicData = mockTopics[slug];
                if (!topicData) {
                    setError("Topic not found");
                    return;
                }

                setTopic(topicData);

                // Calculate total pages
                const totalPostsCount = topicData.postCount;
                setTotalPages(Math.ceil(totalPostsCount / postsPerPage));
            } catch (err) {
                setError("Failed to load topic");
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchTopic();
        }
    }, [slug]);

    // Fetch posts for current page
    useEffect(() => {
        const fetchPosts = async () => {
            if (!topic) return;

            setPostsLoading(true);

            try {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 300));

                const mockPosts = generateMockPosts(topic.name, currentPage);
                setPosts(mockPosts);
            } catch (err) {
                console.error("Failed to load posts:", err);
            } finally {
                setPostsLoading(false);
            }
        };

        fetchPosts();
    }, [topic, currentPage]);

    const handlePageChange = (page) => {
        setSearchParams({ page: page.toString() });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className={styles.topicPage}>
                <div className="container">
                    <Loading size="md" text="Loading topic..." />
                </div>
            </div>
        );
    }

    if (error || !topic) {
        return (
            <div className={styles.topicPage}>
                <div className="container">
                    <EmptyState
                        icon="📚"
                        title="Topic not found"
                        description="The topic you're looking for doesn't exist or has been removed."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.topicPage}>
            <div className="container">
                {/* Topic Header */}
                <TopicHeader topic={topic} />

                {/* Posts List */}
                <PostList
                    posts={posts}
                    loading={postsLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    showPagination={true}
                    className={styles.postsList}
                />
            </div>
        </div>
    );
};

export default Topic;
