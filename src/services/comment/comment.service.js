import httpRequest from "../../utils/httpRequest";

export const createComment = async (slug, data) => {
  try {
    const res = await httpRequest.post(`/posts/${slug}/comments`, data);
    res.data.author = {
      avatar: res.data.author.avatar_url,
      name: res.data.author.full_name,
    };
    res.data.createdAt = res.data.created_at;
    res.data.likes = Number(res.data.like_count);
    return res;
  } catch (err) {
    console.error("Failed to create comment:", err);
    throw err;
  }
};

export const updateComment = async (slug, id, data) => {
  try {
    const res = await httpRequest.patch(`/posts/${slug}/comments/${id}`, data);
    return res;
  } catch (error) {
    console.error("Failed to update comment:", error);
  }
};

export const deleteComment = async (slug, id) => {
  try {
    const res = await httpRequest.del(`/posts/${slug}/comments/${id}`);
    return res;
  } catch (error) {
    console.error("Failed to delete comment:", error);
  }
};

export const getCommentsByPostId = async (slug) => {
  try {
    const res = await httpRequest.get(`/posts/${slug}/comments`);

    const normalizeCommentTree = (comment) => {
      return {
        ...comment,
        author: {
          ...comment.author,
          name: comment.author.full_name,
          avatar: comment.author.avatar_url,
        },
        createdAt: comment.created_at,
        likes: Number(comment.like_count),
        replies: comment.replies?.map(normalizeCommentTree) || [],
      };
    };

    res.data.comments = res.data.comments.map(normalizeCommentTree);
    return res;
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw error;
  }
};

export default {
  createComment,
  updateComment,
  getCommentsByPostId,
  deleteComment,
};
