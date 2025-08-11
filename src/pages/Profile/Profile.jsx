import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthorInfo from "../../components/AuthorInfo/AuthorInfo";
import PostList from "../../components/PostList/PostList";
import Button from "../../components/Button/Button";
import Badge from "../../components/Badge/Badge";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loading from "../../components/Loading/Loading";
import FallbackImage from "../../components/FallbackImage/FallbackImage";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

import styles from "./Profile.module.scss";
import { useSelector } from "react-redux";
import userService from "@/services/user/user.service";
import followService from "@/services/follow/follow.service";

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);

  //stus
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalPost, setTotalPost] = useState(0);
  // Check if this is the user's own profile
  // In a real app, you'd get current user from auth context
  const cur_user = useSelector((state) => state.auth.currentUser);
  const currentUser = cur_user?.username || null; // Mock current user
  const isOwnProfile = currentUser === username;
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page") || 1;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      // Simulate API delay
      const user_profile = await userService.getUser(username);

      setProfile(user_profile.data);
      setLoading(false);
    };

    loadProfile();
  }, [username]);

  useEffect(() => {
    const loadPosts = async () => {
      setPostsLoading(true);
      // Simulate API delay
      const postsData = await userService.getUserPosts(username, page, 6);
      // const newPosts = generatePosts(5);
      setPosts(postsData.data);
      setTotalPages(postsData.pagination.totalPages); // 42 total posts, 6 per page
      setCurrentPage(postsData.pagination.page);
      setPostsLoading(false);
    };

    if (profile) {
      loadPosts();
    }
  }, [profile, currentPage, activeTab]);

  useEffect(() => {
    setFollower(Number(profile?.stats.followers));
    setFollowing(Number(profile?.stats.following));
    setTotalLikes(Number(profile?.stats.likes));
    setTotalPost(Number(profile?.stats.postsCount));
  }, [
    profile?.stats.followers,
    profile?.stats.following,
    profile?.stats.likes,
    profile?.stats.postsCount,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(`/profile/${profile.username}?page=${page}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };
  //Follow Action
  const [follow, setFollow] = useState(false);

  const checkFollow = async () => {
    if (isOwnProfile) return;
    if (!cur_user) {
      return false;
    }

    const data = {
      follow_able_id: profile?.id,
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
  }, [profile?.id, cur_user]);

  const handleFollowClick = async () => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập, vui lòng đăng nhập!");
      return;
    }

    try {
      const data = {
        follow_able_id: profile?.id,
        type: "user",
      };
      if (!follow) {
        await followService.follow(data);
        setFollow(true);
        setFollower((follow) => follow + 1);
      } else {
        await followService.unfollow(data);
        setFollower((follow) => follow - 1);
        setFollow(false);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleMessageClick = () => {
    setIsChatOpen(true);
    setIsChatMinimized(false);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setIsChatMinimized(false);
  };

  const handleChatMinimize = (minimize) => {
    setIsChatMinimized(minimize);
  };

  if (loading) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <Loading size="md" text="Loading profile..." />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.profile}>
        <div className="container">
          <EmptyState
            title="Profile not found"
            description="The user profile you're looking for doesn't exist or has been removed."
            icon="👤"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profile}>
      {/* Cover Section */}
      <div className={styles.coverSection}>
        <div className={styles.coverImage}>
          <FallbackImage src={profile.cover_url} alt="Cover" />
          <div className={styles.coverOverlay}></div>
        </div>

        <div className={styles.profileHeader}>
          <div className="container">
            <div className={styles.headerContent}>
              <div className={styles.avatarSection}>
                <FallbackImage
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className={styles.avatar}
                />
                <div className={styles.basicInfo}>
                  <h1 className={styles.name}>{profile.full_name}</h1>
                  <p className={styles.username}>@{profile.username}</p>
                  {profile.title && (
                    <p className={styles.title}>{profile.title}</p>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                {isOwnProfile ? (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => navigate(`/profile/${username}/edit`)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleFollowClick}
                    >
                      {!follow ? "Follow" : "Un Follow"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={handleMessageClick}
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container">
        <div className={styles.content}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Bio */}
            {profile.bio && (
              <div className={styles.bioCard}>
                <h3>About</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {/* Stats */}
            <div className={styles.statsCard}>
              <h3>Stats</h3>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <strong>{`${totalPost}`.toLocaleString()}</strong>
                  <span>Posts</span>
                </div>
                <div
                  className={styles.stat}
                  onClick={() =>
                    navigate(`/profile/${profile.username}/follower`, {
                      replace: true,
                    })
                  }
                >
                  <strong>{`${follower}`.toLocaleString()}</strong>
                  <span>Followers</span>
                </div>
                <div
                  className={styles.stat}
                  onClick={() =>
                    navigate(`/profile/${profile.username}/following`, {
                      replace: true,
                    })
                  }
                >
                  <strong>{`${following}`.toLocaleString()}</strong>
                  <span>Following</span>
                </div>
                <div className={styles.stat}>
                  <strong>{`${totalLikes}`.toLocaleString()}</strong>
                  <span>Likes</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className={styles.skillsCard}>
                <h3>Skills</h3>
                <div className={styles.skills}>
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div className={styles.badgesCard}>
                <h3>Achievements</h3>
                <div className={styles.badges}>
                  {profile.badges.map((badge) => (
                    <div key={badge.name} className={styles.badge}>
                      <span className={styles.badgeIcon}>{badge.icon}</span>
                      <span className={styles.badgeName}>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className={styles.infoCard}>
              <h3>Info</h3>
              <div className={styles.infoItems}>
                {profile.location && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>📍</span>
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.website && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🌐</span>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                <div className={styles.infoItem}>
                  <span className={styles.infoIcon}>📅</span>
                  <span>Joined {formatDate(profile.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {profile.social && Object.keys(profile.social).length > 0 && (
              <div className={styles.socialCard}>
                <h3>Connect</h3>
                <div className={styles.socialLinks}>
                  {profile.social.twitter && (
                    <a
                      href={profile.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>🐦</span> Twitter
                    </a>
                  )}
                  {profile.social.github && (
                    <a
                      href={profile.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>🐙</span> GitHub
                    </a>
                  )}
                  {profile.social.linkedin && (
                    <a
                      href={profile?.social}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>💼</span> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Main Content */}
          <main className={styles.main}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${
                  activeTab === "posts" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts ({profile.stats.postsCount})
              </button>
              <button
                className={`${styles.tab} ${
                  activeTab === "about" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("about")}
              >
                About
              </button>
            </div>

            {/* Tab Content */}
            <div className={styles.tabContent}>
              {activeTab === "posts" && (
                <div className={styles.postsTab}>
                  <PostList
                    posts={posts}
                    loading={postsLoading}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    layout="grid"
                  />
                </div>
              )}

              {activeTab === "about" && (
                <div className={styles.aboutTab}>
                  <AuthorInfo
                    author={{
                      id: profile.id,
                      name: profile.full_name,
                      username: profile.username,
                      title: profile.title,
                      bio: profile.bio,
                      avatar: profile.avatar_url,
                      social: profile.social,
                      postsCount: profile.stats.postsCount,
                      followers: profile.stats.followers,
                      following: profile.stats.following,
                    }}
                    showFollowButton={false}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Chat Window */}
      {!isOwnProfile && (
        <ChatWindow
          user={{
            id: profile.id,
            name: profile.full_name,
            avatar: profile.avatar_url,
            username: profile.username,
          }}
          isOpen={isChatOpen}
          isMinimized={isChatMinimized}
          onClose={handleChatClose}
          onMinimize={handleChatMinimize}
        />
      )}
    </div>
  );
};

export default Profile;
