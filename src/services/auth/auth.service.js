import httpRequest from "../../utils/httpRequest";

export const getCurrentUser = async () => {
  const res = await httpRequest.get("/auth/me");
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

export const editProfile = async (data) => {
  try {
    const res = await httpRequest.patch("auth/edit-profile", data);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const userSetting = async () => {
  try {
    const res = await httpRequest.get("auth/settings");
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const settings = async (data) => {
  try {
    const res = await httpRequest.patch("auth/settings", data);
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const refreshToken = async () => {
  try {
    const res = await httpRequest.get("/auth/refresh-token");
    return res;
  } catch (err) {
    console.error("Login thất bại:", err);
    throw err;
  }
};

export const login = async (data) => {
  try {
    const res = await httpRequest.post("/auth/login", data);
    return res;
  } catch (err) {
    console.error("Login thất bại:", err);
    throw err;
  }
};

export const register = async (data) => {
  try {
    const res = await httpRequest.post("/auth/register", data);
    return res;
  } catch (err) {
    console.error("Register thất bại:", err);
    throw err;
  }
};

export const checkEmail = async (data) => {
  try {
    const res = await httpRequest.post("/auth/check-email", data);
    return res?.exists ?? false;
  } catch (err) {
    console.error("Check email thất bại:", err);
    return false;
  }
};

export const sendCode = async (data) => {
  try {
    const res = await httpRequest.post("/auth/send-code", data);
    return res;
  } catch (err) {
    console.error("Quá trình tạo mã otp hoặc gửi mã thất bại:", err);
    return false;
  }
};

export const verifyEmail = async (token) => {
  try {
    const res = await httpRequest.post(`/auth/verify-email`, { token });
    return res;
  } catch (err) {
    console.error("Xác thực email thất bại:", err);
    throw err;
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await httpRequest.post(`/auth/forgot-password`, { email });
    return res;
  } catch (err) {
    console.error("Thất bại:", err);
    throw err;
  }
};

export const changePassword = async (data) => {
  try {
    const res = await httpRequest.post(`/auth/change-password`, data);
    return res;
  } catch (err) {
    console.error("Thất bại:", err);
    throw err;
  }
};

export const resetPassword = async (data) => {
  try {
    const res = await httpRequest.post(`/auth/reset-password`, data);
    return res;
  } catch (err) {
    console.error("Thất bại:", err);
    throw err;
  }
};

export const logout = async () => {
  try {
    const res = await httpRequest.post("/auth/logout");
    return res;
  } catch (err) {
    console.error("Logout thất bại:", err);
    throw err;
  }
};

export default {
  getCurrentUser,
  refreshToken,
  login,
  register,
  editProfile,
  settings,
  userSetting,
  checkEmail,
  sendCode,
  verifyEmail,
  forgotPassword,
  changePassword,
  resetPassword,
  logout,
};
