import httpRequest from "@/utils/httpRequest";

export const createConversation = async (otherUserId, data = {}) => {
  try {
    const res = httpRequest.post("/conversations", {
      participant_id: otherUserId,
      ...data,
    });
    return res.data;
  } catch (err) {
    console.error("Failed to create conversation:", err);
    throw err;
  }
};

export const getOrCreateConversation = async (otherUserId) => {
  try {
    const res = await httpRequest.post("/conversations/get-or-create", {
      participant_id: otherUserId,
    });
    return res.data;
  } catch (err) {
    console.error("Failed to get or create conversation:", err);
    throw err;
  }
};

export const getConversations = async () => {
  try {
    const res = await httpRequest.get("/conversations");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch conversations:", err);
    throw err;
  }
};

export const getConversationById = async (id) => {
  try {
    const res = await httpRequest.get(`/conversations/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch conversation:", err);
    throw err;
  }
};

export const updateConversation = async (id, data) => {
  try {
    const res = await httpRequest.put(`/conversations/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Failed to update conversation:", err);
    throw err;
  }
};

export const deleteConversation = async (id) => {
  try {
    const res = await httpRequest.delete(`/conversations/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete conversation:", err);
    throw err;
  }
};

export default {
  createConversation,
  getOrCreateConversation,
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
};
