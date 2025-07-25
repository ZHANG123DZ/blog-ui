import httpRequest from "../../utils/httpRequest";

export const getPublicIdFromUrl = async () => {
  const res = await httpRequest.get("/upload/get");
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

export const uploadSingleFile = async (data) => {
  try {
    const res = await httpRequest.post("/upload/upload-file", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    console.error("Tải lên thất bại:", err);
    throw err;
  }
};

export const uploadMultipleFiles = async (data) => {
  try {
    const res = await httpRequest.post("/upload/upload-multi-file", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    console.error("Tải file lên thất bại:", err);
    throw err;
  }
};

export const replace = async (data) => {
  try {
    const res = await httpRequest.patch("/upload/replace", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    console.error("Thay thế file thất bại:", err);
    throw err;
  }
};

export const deleteFile = async (data) => {
  try {
    const res = await httpRequest.del(`/upload/delete/${data.url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch (err) {
    console.error("Xóa file thất bại:", err);
    throw err;
  }
};

export default {
  getPublicIdFromUrl,
  uploadSingleFile,
  uploadMultipleFiles,
  deleteFile,
  replace,
};
