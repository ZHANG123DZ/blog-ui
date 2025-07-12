import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Badge from "../Badge/Badge";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./BlogContent.module.scss";

const BlogContent = ({
    title,
    content,
    author,
    publishedAt,
    updatedAt,
    readTime,
    topic,
    tags = [],
    featuredImage,
    loading = false,
    className,
    ...props
}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <article
                className={`${styles.blogContent} ${className || ""}`}
                {...props}
            >
                <div className={styles.skeleton}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonHeader}>
                        <div className={styles.skeletonTitle} />
                        <div className={styles.skeletonMeta} />
                    </div>
                    <div className={styles.skeletonContent}>
                        {Array.from({ length: 8 }, (_, i) => (
                            <div key={i} className={styles.skeletonParagraph} />
                        ))}
                    </div>
                </div>
            </article>
        );
    }

    return (
        <article
            className={`${styles.blogContent} ${className || ""}`}
            {...props}
        >
            {/* Featured Image */}
            {featuredImage && (
                <div className={styles.imageContainer}>
                    <FallbackImage
                        src={featuredImage}
                        alt={title}
                        className={styles.featuredImage}
                    />
                </div>
            )}

            {/* Article Header */}
            <header className={styles.header}>
                {/* Topic Badge */}
                {topic && (
                    <div className={styles.topicBadge}>
                        <Badge variant="primary" size="md">
                            {topic}
                        </Badge>
                    </div>
                )}

                {/* Title */}
                <h1 className={styles.title}>{title}</h1>

                {/* Meta Information */}
                <div className={styles.meta}>
                    <div className={styles.author}>
                        {author?.avatar && (
                            <FallbackImage
                                src={author.avatar}
                                alt={author.name}
                                className={styles.authorAvatar}
                            />
                        )}
                        <div className={styles.authorInfo}>
                            <Link
                                to={`/profile/${
                                    author?.username ||
                                    author?.name
                                        ?.toLowerCase()
                                        .replace(/\s+/g, "-")
                                }`}
                                className={styles.authorName}
                            >
                                {author?.name}
                            </Link>
                            <div className={styles.dateInfo}>
                                <time
                                    dateTime={publishedAt}
                                    className={styles.publishDate}
                                >
                                    {formatDate(publishedAt)}
                                </time>
                                {updatedAt && updatedAt !== publishedAt && (
                                    <span className={styles.updateInfo}>
                                        • Updated {formatDate(updatedAt)}
                                    </span>
                                )}
                                {readTime && (
                                    <span className={styles.readTime}>
                                        • {readTime} min read
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Article Content */}
            <div className={styles.content}>
                {typeof content === "string" ? (
                    <div
                        className={styles.htmlContent}
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                ) : (
                    content
                )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <footer className={styles.footer}>
                    <div className={styles.tags}>
                        <span className={styles.tagsLabel}>Tags:</span>
                        <div className={styles.tagsList}>
                            {tags.map((tag, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    size="sm"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </footer>
            )}
        </article>
    );
};

BlogContent.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    author: PropTypes.shape({
        name: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        username: PropTypes.string,
    }).isRequired,
    publishedAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string,
    readTime: PropTypes.number,
    topic: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    featuredImage: PropTypes.string,
    loading: PropTypes.bool,
    className: PropTypes.string,
};

export default BlogContent;
