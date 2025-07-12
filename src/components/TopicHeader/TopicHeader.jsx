import PropTypes from "prop-types";
import Badge from "../Badge/Badge";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./TopicHeader.module.scss";

const TopicHeader = ({ topic, loading = false, className, ...props }) => {
    if (loading) {
        return (
            <div
                className={`${styles.topicHeader} ${className || ""}`}
                {...props}
            >
                <div className={styles.skeleton}>
                    <div className={styles.skeletonIcon} />
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonTitle} />
                        <div className={styles.skeletonDescription} />
                        <div className={styles.skeletonMeta} />
                    </div>
                </div>
            </div>
        );
    }

    if (!topic) {
        return null;
    }

    return (
        <div className={`${styles.topicHeader} ${className || ""}`} {...props}>
            <div className={styles.content}>
                {/* Topic Icon */}
                {topic.icon && (
                    <div className={styles.iconContainer}>
                        {typeof topic.icon === "string" ? (
                            <span className={styles.emoji}>{topic.icon}</span>
                        ) : (
                            <FallbackImage
                                src={topic.icon}
                                alt={topic.name}
                                className={styles.image}
                            />
                        )}
                    </div>
                )}

                {/* Topic Info */}
                <div className={styles.info}>
                    <h1 className={styles.title}>{topic.name}</h1>

                    {topic.description && (
                        <p className={styles.description}>
                            {topic.description}
                        </p>
                    )}

                    <div className={styles.meta}>
                        <Badge variant="primary" size="md">
                            {topic.postCount || 0} posts
                        </Badge>

                        {topic.createdAt && (
                            <span className={styles.created}>
                                Created{" "}
                                {new Date(topic.createdAt).getFullYear()}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

TopicHeader.propTypes = {
    topic: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        icon: PropTypes.string,
        postCount: PropTypes.number,
        createdAt: PropTypes.string,
    }),
    loading: PropTypes.bool,
    className: PropTypes.string,
};

export default TopicHeader;
