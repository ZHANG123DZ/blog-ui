import httpRequest from "../../utils/httpRequest";

export const getUser = async (userName) => {
  const res = await httpRequest.get(`/users/${userName}`);
  const data = res.data;
  data.social = JSON.parse(data.social) || {};
  data.stats = {
    postsCount: Number(data.post_count) || 0,
    followers: Number(data.follower_count) || 0,
    following: Number(data.following_count) || 0,
    likes: Number(data.like_count) || 0,
  };
  data.joinedDate = data.created_at;
  const skills = data.skillList.map((skill) => skill.name);
  data.skills = skills;
  return res;
};

export const getUserPosts = async (userName) => {
  const res = await httpRequest.get(`/users/${userName}/posts`);
  res.data = res.data.map((post) => ({
    ...post,
    id: Number(post.id),
    author: {
      name: post.author_name,
      avatar: post.author_avatar,
      username: post.author_username,
    },
    topics: post.topics?.map((topic) => topic.name) || [],
    publishedAt: post.published_at,
    readTime: Number(post.reading_time),
    featuredImage: post.thumbnail_url,
    coverImage: post.cover_url,
    likes: Number(post.like_count),
    comments: Number(post.comment_count),
  }));
  return res;
};

export default { getUser, getUserPosts };
