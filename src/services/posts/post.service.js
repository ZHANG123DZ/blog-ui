import httpRequest from "../../utils/httpRequest";

export const createPost = async (data) => {
  try {
    const res = await httpRequest.post(`/posts`, data);
    return res;
  } catch (err) {
    console.error("Failed to create comment:", err);
    throw err;
  }
};

export const updatePost = async (slug, data) => {
  try {
    const res = await httpRequest.patch(`/posts/${slug}`, data);
    return res;
  } catch (error) {
    console.error("Failed to update comment:", error);
  }
};

export const deletePost = async (slug) => {
  try {
    const res = await httpRequest.del(`/posts/${slug}`);
    return res;
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
};

export const getPosts = async () => {
  try {
    const res = await httpRequest.get(`/posts`);
    return res;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
};

export const getPost = async (slug) => {
  try {
    const res = await httpRequest.get(`/posts/${slug}`);
    const data = res.data;
    const author = data.author || {};

    return {
      ...res,
      data: {
        ...data,
        author: {
          ...author,
          id: author.id,
          name: author.full_name,
          avatar: author.avatar_url,
          username: author.username,
          social:
            typeof author.social === "string"
              ? JSON.parse(author.social)
              : author.social || {},
          postsCount: Number(author.post_count) || 0,
          followers: Number(author.follower_count) || 0,
          following: Number(author.following_count) || 0,
        },
        topics: data.topics?.map((topic) => topic.name) || [],
        tags: data.tags?.map((tag) => tag.name) || [],
        publishedAt: data.published_at,
        readTime: data.reading_time,
        featuredImage: data.cover_url,
        likes: data.like_count,
        views: data.view_count,
        comments: data.comments.map((comment) => ({
          id: comment.id,
          author: {
            name: comment.author.full_name,
            avatar: comment.author.avatar_url,
          },
          content: comment.content,
          createdAt: comment.created_at,
          likes: comment.like_count,
          // : comment.created_at,
        })),
      },
    };
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
};

export const getFeaturedPost = async () => {
  try {
    const res = await httpRequest.get(`/posts/featured`);
    res.data = res.data.map((post) => ({
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
      likes: Number(post.like_count),
      views: Number(post.like_count),
      comments: Number(post.comment_count),
    }));

    return res;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
};

export const getRelatedPost = async (preTopics) => {
  try {
    const res = await httpRequest.post(`/posts/related`, { topics: preTopics });
    res.data = res.data.map((post) => ({
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
      likes: Number(post.like_count),
      views: Number(post.like_count),
      comments: Number(post.comment_count),
    }));

    return res;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
};

export const getLatestPost = async () => {
  try {
    const res = await httpRequest.get(`/posts/latest`);
    return res;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
};

export default {
  createPost,
  updatePost,
  deletePost,
  getPosts,
  getPost,
  getRelatedPost,
  getFeaturedPost,
  getLatestPost,
};
