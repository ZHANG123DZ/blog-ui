import httpRequest from '../../utils/httpRequest';

export const createComment = async (post_id, data) => {
  try {
    const res = await httpRequest.post(`/posts/${post_id}/comments`, data);
    return res;
  } catch (err) {
    console.error('Failed to create comment:', err);
    throw err;
  }
};

export const updateComment = async (post_id, id, data) => {
  try {
    const res = await httpRequest.patch(
      `/posts/${post_id}/comments/${id}`,
      data
    );
    return res;
  } catch (error) {
    console.error('Failed to update comment:', error);
  }
};

export const deleteComment = async (post_id, id) => {
  try {
    const res = await httpRequest.del(`/posts/${post_id}/comments/${id}`);
    return res;
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
};

export const getCommentsByPostId = async (post_id) => {
  try {
    const res = await httpRequest.get(`/posts/${post_id}/comments`);
    return res;
  } catch (error) {
    console.error('Failed to fetch comments:', error);
  }
};
