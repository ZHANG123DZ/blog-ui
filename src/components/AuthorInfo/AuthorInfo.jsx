import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import FallbackImage from "../FallbackImage/FallbackImage";
import styles from "./AuthorInfo.module.scss";
import followService from "@/services/follow/follow.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const AuthorInfo = ({
  author,
  showSocial = true,
  showBio = true,
  showFollowButton = true,
  loading = false,
  className,
  ...props
}) => {
  const cur_user = useSelector((state) => state.auth.currentUser);
  const [follow, setFollow] = useState(false);
  const checkFollow = async () => {
    if (!cur_user) {
      return false;
    }

    const data = {
      follow_able_id: author?.id,
      type: "user",
    };

    try {
      const isFollowing = await followService.check(data);
      return isFollowing.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  useEffect(() => {
    const fetchFollowState = async () => {
      const result = await checkFollow();
      setFollow(result);
    };

    fetchFollowState();
  }, [author?.id, cur_user]);

  const handleFollowClick = async () => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return;
    }

    try {
      const data = {
        follow_able_id: author?.id,
        type: "user",
      };
      if (!follow) {
        await followService.follow(data);
        setFollow(true);
      } else {
        await followService.unfollow(data);
        setFollow(false);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  if (loading) {
    return (
      <div className={`${styles.authorInfo} ${className || ""}`} {...props}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonAvatar} />
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonName} />
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonBio} />
            <div className={styles.skeletonSocial} />
          </div>
        </div>
      </div>
    );
  }

  if (!author) {
    return null;
  }

  const {
    name,
    title,
    bio,
    avatar,
    social = {},
    postsCount,
    followers,
    following,
  } = author;

  return (
    <div className={`${styles.authorInfo} ${className || ""}`} {...props}>
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          <FallbackImage src={avatar} alt={name} className={styles.avatar} />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>
            <Link
              to={`/profile/${
                author?.username || name?.toLowerCase().replace(/\s+/g, "-")
              }`}
              className={styles.nameLink}
            >
              {name}
            </Link>
          </h3>
          {title && <p className={styles.title}>{title}</p>}

          {/* Stats */}
          <div className={styles.stats}>
            {postsCount !== undefined && (
              <span className={styles.stat}>
                <strong>{postsCount}</strong> Posts
              </span>
            )}
            {followers !== undefined && (
              <span className={styles.stat}>
                <strong>{followers}</strong> Followers
              </span>
            )}
            {following !== undefined && (
              <span className={styles.stat}>
                <strong>{following}</strong> Following
              </span>
            )}
          </div>
        </div>

        {showFollowButton && (
          <div className={styles.action} onClick={handleFollowClick}>
            <Button size="sm" variant="primary">
              {follow ? "Đã follow" : "Follow"}
            </Button>
          </div>
        )}
      </div>

      {showBio && bio && (
        <div className={styles.bio}>
          <p>{bio}</p>
        </div>
      )}

      {showSocial && Object.keys(social).length > 0 && (
        <div className={styles.social}>
          <span className={styles.socialLabel}>Connect:</span>
          <div className={styles.socialLinks}>
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="Twitter"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="GitHub"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="LinkedIn"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
            {social.website && (
              <a
                href={social.website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="Website"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

AuthorInfo.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string,
    title: PropTypes.string,
    bio: PropTypes.string,
    avatar: PropTypes.string.isRequired,
    social: PropTypes.shape({
      twitter: PropTypes.string,
      github: PropTypes.string,
      linkedin: PropTypes.string,
      website: PropTypes.string,
    }),
    postsCount: PropTypes.number,
    followers: PropTypes.number,
    following: PropTypes.number,
  }),
  showSocial: PropTypes.bool,
  showBio: PropTypes.bool,
  showFollowButton: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

export default AuthorInfo;
