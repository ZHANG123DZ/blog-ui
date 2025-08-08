import { Button, FallbackImage } from "@/components";
import followService from "@/services/follow/follow.service";
import userService from "@/services/user/user.service";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./Following.module.scss";
import { useSelector } from "react-redux";

const Following = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const cur_user = useSelector((state) => state.auth.currentUser);

  const [profileUser, setProfileUser] = useState(null);
  const [followings, setFollowings] = useState([]);
  const [followStates, setFollowStates] = useState({}); // follow state theo userId

  // Lấy user profile theo username
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getUser(username);
        setProfileUser(res.data);
      } catch (error) {
        console.error("Lỗi lấy user:", error);
      }
    };
    fetchUser();
  }, [username]);

  // Lấy danh sách followings của user
  useEffect(() => {
    const fetchFollowings = async () => {
      if (!profileUser?.id) return;
      try {
        const data = {
          type: "user",
          userId: profileUser.id,
        };
        const res = await followService.getFollowing(data);

        setFollowings(res.data.users || []);
      } catch (err) {
        console.error("Lỗi lấy followings:", err);
      }
    };
    fetchFollowings();
  }, [profileUser?.id]);

  // Check trạng thái follow từng người (nếu là user khác)
  useEffect(() => {
    const checkFollows = async () => {
      if (!cur_user?.id || !followings.length) return;

      const followResults = await Promise.all(
        followings.map(async (user) => {
          if (cur_user.username === user.username) return { [user.id]: null };
          try {
            const res = await followService.check({
              follow_able_id: user.id,
              type: "user",
            });
            return { [user.id]: res.data };
          } catch {
            return { [user.id]: false };
          }
        })
      );

      // Gộp kết quả về 1 object
      const state = followResults.reduce(
        (acc, cur) => ({ ...acc, ...cur }),
        {}
      );
      setFollowStates(state);
    };

    checkFollows();
  }, [cur_user?.id, followings]);

  // Follow / Unfollow một người
  const toggleFollow = async (targetUserId) => {
    if (!cur_user) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    const isFollowing = followStates[targetUserId];
    const data = {
      follow_able_id: targetUserId,
      type: "user",
    };

    try {
      if (isFollowing) {
        await followService.unfollow(data);
      } else {
        await followService.follow(data);
      }
      setFollowStates((prev) => ({
        ...prev,
        [targetUserId]: !isFollowing,
      }));
    } catch (err) {
      console.error("Lỗi follow/unfollow:", err);
    }
  };

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-6"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 className="text-2xl font-semibold mb-6 text-center">
        <span
          style={{ color: "blue" }}
          className={styles.userProfile}
          onClick={() =>
            navigate(`/profile/${profileUser.username}`, { replace: true })
          }
        >
          {profileUser?.full_name}
        </span>{" "}
        đang theo dõi {followings.length} người
      </h1>
      {followings.length === 0 ? (
        <p className="text-center text-gray-500">
          <span
            className={styles.userProfile}
            style={{ color: "blue" }}
            onClick={() =>
              navigate(`/profile/${profileUser.username}`, { replace: true })
            }
          >
            {profileUser?.full_name}
          </span>
          chưa theo dõi ai cả.
        </p>
      ) : (
        <div className="space-y-4">
          {followings.map((followedUser) => (
            <div
              key={followedUser.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <div className={styles.header}>
                <div className={styles.avatarContainer}>
                  <FallbackImage
                    src={followedUser.avatar_url}
                    alt={followedUser.full_name}
                    className={styles.avatar}
                  />
                </div>

                <div className={styles.info}>
                  <h3 className={styles.name}>
                    <Link
                      to={`/profile/${followedUser.username}`}
                      className={styles.nameLink}
                    >
                      {followedUser.full_name}
                    </Link>
                  </h3>
                  {followedUser.title && (
                    <p className={styles.title}>{followedUser.title}</p>
                  )}

                  <div className={styles.stats}>
                    {followedUser.post_count !== undefined && (
                      <span className={styles.stat}>
                        <strong>{followedUser.post_count}</strong> Posts
                      </span>
                    )}
                    {followedUser.follower_count !== undefined && (
                      <span className={styles.stat}>
                        <strong>{followedUser.follower_count}</strong> Followers
                      </span>
                    )}
                    {followedUser.following_count !== undefined && (
                      <span
                        className={styles.stat}
                        onClick={() =>
                          navigate(
                            `/profile/${followedUser.username}/following`,
                            { replace: true }
                          )
                        }
                      >
                        <strong>{followedUser.following_count}</strong>{" "}
                        Following
                      </span>
                    )}
                  </div>
                </div>

                {/* Nút follow nếu không phải chính mình */}
                {cur_user?.username !== followedUser.username && (
                  <div
                    className={styles.action}
                    onClick={() => toggleFollow(followedUser.id)}
                  >
                    <Button size="sm" variant="primary">
                      {followStates[followedUser.id] ? "Un Follow" : "Follow"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Following;
