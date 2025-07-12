import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TopicList, FeaturedPosts, PostList, Button } from "../../components";
import styles from "./Home.module.scss";

const Home = () => {
    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data - will be replaced with API calls later
    const mockTopics = [
        {
            id: 1,
            name: "JavaScript",
            slug: "javascript",
            description:
                "Everything about JavaScript programming language, frameworks, and best practices",
            icon: "🚀",
            postCount: 45,
        },
        {
            id: 2,
            name: "React",
            slug: "react",
            description:
                "React.js tutorials, tips, and advanced patterns for building modern web applications",
            icon: "⚛️",
            postCount: 32,
        },
        {
            id: 3,
            name: "Node.js",
            slug: "nodejs",
            description:
                "Server-side JavaScript development with Node.js and its ecosystem",
            icon: "🟢",
            postCount: 28,
        },
        {
            id: 4,
            name: "CSS",
            slug: "css",
            description:
                "Modern CSS techniques, animations, and responsive design patterns",
            icon: "🎨",
            postCount: 23,
        },
    ];

    const mockFeaturedPosts = [
        {
            id: 1,
            title: "Mastering React Hooks: A Complete Guide",
            excerpt:
                "Learn how to use React Hooks effectively to manage state, side effects, and create reusable custom hooks in your React applications.",
            author: {
                name: "Sarah Chen",
                avatar: "https://via.placeholder.com/32?text=SC",
            },
            publishedAt: "2024-01-15",
            readTime: 12,
            topic: "React",
            slug: "mastering-react-hooks-complete-guide",
            featuredImage:
                "https://via.placeholder.com/600x300?text=React+Hooks",
        },
        {
            id: 2,
            title: "Modern CSS Layout Techniques in 2024",
            excerpt:
                "Explore the latest CSS Grid, Flexbox, and Container Queries to create responsive and maintainable layouts.",
            author: {
                name: "Alex Rivera",
                avatar: "https://via.placeholder.com/32?text=AR",
            },
            publishedAt: "2024-01-12",
            readTime: 10,
            topic: "CSS",
            slug: "modern-css-layout-techniques-2024",
            featuredImage:
                "https://via.placeholder.com/600x300?text=CSS+Layout",
        },
        {
            id: 3,
            title: "Building Scalable Node.js Applications",
            excerpt:
                "Best practices and architectural patterns for creating maintainable and performant Node.js applications at scale.",
            author: {
                name: "Michael Johnson",
                avatar: "https://via.placeholder.com/32?text=MJ",
            },
            publishedAt: "2024-01-10",
            readTime: 15,
            topic: "Node.js",
            slug: "building-scalable-nodejs-applications",
            featuredImage:
                "https://via.placeholder.com/600x300?text=Node.js+Scale",
        },
    ];

    const generateRecentPosts = () => {
        return [
            {
                id: 4,
                title: "TypeScript Best Practices for Large Applications",
                excerpt:
                    "Essential TypeScript patterns and configurations for enterprise-level applications.",
                author: {
                    name: "Emily Wang",
                    avatar: "https://via.placeholder.com/32?text=EW",
                },
                publishedAt: "2024-01-08",
                readTime: 8,
                topic: "TypeScript",
                slug: "typescript-best-practices-large-applications",
                featuredImage:
                    "https://via.placeholder.com/400x200?text=TypeScript",
            },
            {
                id: 5,
                title: "Advanced JavaScript Performance Optimization",
                excerpt:
                    "Techniques to optimize JavaScript performance in modern web applications.",
                author: {
                    name: "David Kim",
                    avatar: "https://via.placeholder.com/32?text=DK",
                },
                publishedAt: "2024-01-06",
                readTime: 11,
                topic: "JavaScript",
                slug: "advanced-javascript-performance-optimization",
                featuredImage:
                    "https://via.placeholder.com/400x200?text=JS+Performance",
            },
            {
                id: 6,
                title: "Responsive Design with Container Queries",
                excerpt:
                    "Learn how to use CSS Container Queries for truly component-based responsive design.",
                author: {
                    name: "Lisa Park",
                    avatar: "https://via.placeholder.com/32?text=LP",
                },
                publishedAt: "2024-01-04",
                readTime: 7,
                topic: "CSS",
                slug: "responsive-design-container-queries",
                featuredImage:
                    "https://via.placeholder.com/400x200?text=Container+Queries",
            },
            {
                id: 7,
                title: "React Server Components Deep Dive",
                excerpt:
                    "Understanding React Server Components and how they revolutionize full-stack development.",
                author: {
                    name: "Tom Anderson",
                    avatar: "https://via.placeholder.com/32?text=TA",
                },
                publishedAt: "2024-01-02",
                readTime: 13,
                topic: "React",
                slug: "react-server-components-deep-dive",
                featuredImage:
                    "https://via.placeholder.com/400x200?text=Server+Components",
            },
            {
                id: 8,
                title: "GraphQL vs REST: A 2024 Comparison",
                excerpt:
                    "Compare GraphQL and REST APIs to choose the right approach for your next project.",
                author: {
                    name: "Maria Garcia",
                    avatar: "https://via.placeholder.com/32?text=MG",
                },
                publishedAt: "2023-12-30",
                readTime: 9,
                topic: "API",
                slug: "graphql-vs-rest-2024-comparison",
                featuredImage:
                    "https://via.placeholder.com/400x200?text=GraphQL+REST",
            },
            {
                id: 9,
                title: "Web Accessibility in Modern Applications",
                excerpt:
                    "Essential techniques and tools for building accessible web applications that work for everyone.",
                author: {
                    name: "James Wilson",
                    avatar: "https://via.placeholder.com/32?text=JW",
                },
                publishedAt: "2023-12-28",
                readTime: 10,
                topic: "Accessibility",
                slug: "web-accessibility-modern-applications",
                featuredImage:
                    "https://via.placeholder.com/400x200?text=Accessibility",
            },
        ];
    };

    useEffect(() => {
        const loadRecentPosts = async () => {
            setLoading(true);
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            setRecentPosts(generateRecentPosts());
            setLoading(false);
        };

        loadRecentPosts();
    }, []);

    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <div className={styles.heroContent}>
                        <div className={styles.heroText}>
                            <h1 className={styles.heroTitle}>
                                Learn{" "}
                                <span className={styles.heroHighlight}>
                                    Modern Web Development
                                </span>{" "}
                                with Expert Insights
                            </h1>
                            <p className={styles.heroDescription}>
                                Discover cutting-edge tutorials, best practices,
                                and industry insights from experienced
                                developers. Stay ahead with the latest
                                technologies and frameworks.
                            </p>
                            <div className={styles.heroActions}>
                                <Button variant="primary" size="lg" asChild>
                                    <Link to="/topics">Explore Topics</Link>
                                </Button>
                                <Button
                                    component="a"
                                    variant="ghost"
                                    size="lg"
                                    href="#featured"
                                    className={styles.heroButton}
                                >
                                    Featured Posts
                                </Button>
                            </div>
                        </div>
                        <div className={styles.heroVisual}>
                            <div className={styles.heroCard}>
                                <div className={styles.heroCardHeader}>
                                    <div className={styles.heroCardDots}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className={styles.heroCardContent}>
                                    <div className={styles.heroCode}>
                                        <div className={styles.codeLine}>
                                            <span
                                                className={styles.codeKeyword}
                                            >
                                                const
                                            </span>
                                            <span
                                                className={styles.codeVariable}
                                            >
                                                {" "}
                                                knowledge
                                            </span>
                                            <span
                                                className={styles.codeOperator}
                                            >
                                                {" "}
                                                ={" "}
                                            </span>
                                            <span className={styles.codeString}>
                                                &apos;power&apos;
                                            </span>
                                        </div>
                                        <div className={styles.codeLine}>
                                            <span
                                                className={styles.codeKeyword}
                                            >
                                                function
                                            </span>
                                            <span
                                                className={styles.codeFunction}
                                            >
                                                {" "}
                                                learn
                                            </span>
                                            <span
                                                className={styles.codeBracket}
                                            >
                                                ()
                                            </span>
                                            <span
                                                className={styles.codeBracket}
                                            >
                                                {" "}
                                                {"{"}
                                            </span>
                                        </div>
                                        <div className={styles.codeLine}>
                                            <span className={styles.codeIndent}>
                                                {" "}
                                            </span>
                                            <span
                                                className={styles.codeKeyword}
                                            >
                                                return
                                            </span>
                                            <span
                                                className={styles.codeVariable}
                                            >
                                                {" "}
                                                success
                                            </span>
                                        </div>
                                        <div className={styles.codeLine}>
                                            <span
                                                className={styles.codeBracket}
                                            >
                                                {"}"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container">
                {/* Featured Posts */}
                <section id="featured" className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>
                            Featured Articles
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Hand-picked content from our expert contributors
                        </p>
                    </div>
                    <FeaturedPosts
                        posts={mockFeaturedPosts}
                        maxPosts={3}
                        showTitle={false}
                    />
                </section>

                {/* Recent Posts */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Latest Posts</h2>
                        <p className={styles.sectionSubtitle}>
                            Fresh content updated regularly
                        </p>
                    </div>
                    <PostList
                        posts={recentPosts}
                        loading={loading}
                        showPagination={false}
                        layout="grid"
                        className={styles.recentPosts}
                    />
                    <div className={styles.sectionAction}>
                        <Button variant="secondary" size="lg" asChild>
                            <Link to="/topics">View All Posts</Link>
                        </Button>
                    </div>
                </section>

                {/* Trending Topics */}
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Trending Topics</h2>
                        <p className={styles.sectionSubtitle}>
                            Popular categories our readers love
                        </p>
                    </div>
                    <TopicList topics={mockTopics} />
                    <div className={styles.sectionAction}>
                        <Button variant="secondary" asChild>
                            <Link to="/topics">Explore All Topics</Link>
                        </Button>
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className={styles.newsletter}>
                    <div className={styles.newsletterCard}>
                        <div className={styles.newsletterContent}>
                            <h3 className={styles.newsletterTitle}>
                                Stay Updated
                            </h3>
                            <p className={styles.newsletterDescription}>
                                Get the latest tutorials and insights delivered
                                to your inbox weekly. Join our community of
                                developers!
                            </p>
                            <div className={styles.newsletterActions}>
                                <Button variant="primary" size="lg">
                                    Subscribe Newsletter
                                </Button>
                            </div>
                        </div>
                        <div className={styles.newsletterVisual}>📧</div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
