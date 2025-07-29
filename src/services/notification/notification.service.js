import httpRequest from "@/utils/httpRequest";

export const getNotification = async () => {
  try {
    const res = httpRequest.get("/notifications");
    return res;
  } catch (err) {
    console.error("Failed to get notifications:", err);
    throw err;
  }
};

export const update = async (notificationId, data) => {
  try {
    const res = httpRequest.patch(`/notifications/${notificationId}`, data);
    return res;
  } catch (err) {
    console.error("Failed to get notifications:", err);
    throw err;
  }
};

export default {
  getNotification,
  update,
};
