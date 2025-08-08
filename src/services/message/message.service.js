import httpRequest from "@/utils/httpRequest";

export const getMessagesByConversationId = async (slug) => {
  try {
    const res = await httpRequest.get(`/conversations/${slug}/messages`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};

export const createMessage = async (slug, data) => {
  try {
    const res = await httpRequest.post(`/conversations/${slug}/messages`, data);
    return res;
  } catch (err) {
    console.error("Failed to create message:", err);
    throw err;
  }
};

export const updateMessage = async (slug, id, data) => {
  try {
    const res = await httpRequest.patch(
      `/conversations/${slug}/messages/${id}`,
      data
    );
    return res;
  } catch (error) {
    console.error("Failed to update message:", error);
    throw error;
  }
};

export const deleteMessage = async (slug, id) => {
  try {
    const res = await httpRequest.delete(
      `/conversations/${slug}/messages/${id}`
    );
    return res;
  } catch (error) {
    console.error("Failed to delete message:", error);
    throw error;
  }
};

export const chatAI = async (slug, data) => {
  try {
    const res = await httpRequest.post(
      `/conversations/${slug}/messages/chat-bot`,
      data
    );
    return res;
  } catch (error) {
    console.error("Failed to response message:", error);
    throw error;
  }
};

export default {
  getMessagesByConversationId,
  createMessage,
  updateMessage,
  deleteMessage,
  chatAI,
};
