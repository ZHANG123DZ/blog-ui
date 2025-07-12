import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Badge from "../Badge/Badge";
import EmptyState from "../EmptyState/EmptyState";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./TopicList.module.scss";

const TopicList = ({ topics = [], loading = false, className, ...props }) => {
    if (loading) {
        return (
            <div
                className={`${styles.topicList} ${className || ""}`}
                {...props}
            >
                <div className={styles.loadingSkeleton}>
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} className={styles.skeletonItem} />
                    ))}
                </div>
            </div>
        );
    }

    if (!topics.length) {
        return (
            <div
                className={`${styles.topicList} ${className || ""}`}
                {...props}
            >
                <EmptyState
                    title="No topics found"
                    description="There are no topics available at the moment."
                    icon="📚"
                />
            </div>
        );
    }

    return (
        <div className={`${styles.topicList} ${className || ""}`} {...props}>
            <div className={styles.grid}>
                {topics.map((topic) => (
                    <Link
                        key={topic.id}
                        to={`/topics/${topic.slug}`}
                        className={styles.topicCard}
                    >
                        <div className={styles.cardContent}>
                            {/* Topic Icon/Image */}
                            {topic.icon && (
                                <div className={styles.iconContainer}>
                                    {typeof topic.icon === "string" ? (
                                        <span className={styles.emoji}>
                                            {topic.icon}
                                        </span>
                                    ) : (
                                        <FallbackImage
                                            src={topic.icon}
                                            alt={topic.name}
                                            className={styles.image}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Topic Name */}
                            <h3 className={styles.topicName}>{topic.name}</h3>

                            {/* Topic Description */}
                            {topic.description && (
                                <p className={styles.description}>
                                    {topic.description}
                                </p>
                            )}

                            {/* Post Count */}
                            <div className={styles.meta}>
                                <Badge variant="secondary" size="sm">
                                    {topic.postCount || 0} posts
                                </Badge>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

TopicList.propTypes = {
    topics: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            name: PropTypes.string.isRequired,
            slug: PropTypes.string.isRequired,
            description: PropTypes.string,
            icon: PropTypes.string,
            postCount: PropTypes.number,
        })
    ),
    loading: PropTypes.bool,
    className: PropTypes.string,
};

export default TopicList;
