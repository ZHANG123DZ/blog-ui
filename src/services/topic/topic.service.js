import httpRequest from "../../utils/httpRequest";

export const createTopic = async (data) => {
  try {
    const res = await httpRequest.post(`/topics`, data);
    return res;
  } catch (err) {
    console.error("Failed to create comment:", err);
    throw err;
  }
};

export const updateTopic = async (slug, data) => {
  try {
    const res = await httpRequest.patch(`/topics/${slug}`, data);
    return res;
  } catch (error) {
    console.error("Failed to update comment:", error);
  }
};

export const deleteTopic = async (slug) => {
  try {
    const res = await httpRequest.del(`/topics/${slug}`);
    return res;
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
};

export const getTopics = async () => {
  try {
    const res = await httpRequest.get(`/topics`);
    res.data.forEach((topic) => {
      topic.icon = topic.icon_url;
      topic.postCount = topic.post_count;
      topic.createdAt = topic.created_at;
    });
    return res;
  } catch (error) {
    console.error("Failed to fetch topics:", error);
  }
};

export const getTopic = async (slug) => {
  try {
    const res = await httpRequest.get(`/topics/${slug}`);
    res.data.postCount = res.data.post_count;
    res.data.icon = res.data.icon_url;
    res.data.createdAt = res.data.created_at;
    res.data.posts = res.data.posts.map((post) => ({
      ...post,
      author: {
        name: post.author_name,
        avatar: post.author_avatar,
        username: post.author_username,
      },
      topics: post.topics?.map((topic) => topic.name) || [],
      publishedAt: post.published_at,
      readTime: post.reading_time,
      featuredImage: post.cover_url,
      likes: post.like_count,
      comments: post.comment_count,
    }));
    return res;
  } catch (error) {
    console.error("Failed to fetch topics:", error);
  }
};

export default { createTopic, updateTopic, deleteTopic, getTopics, getTopic };
