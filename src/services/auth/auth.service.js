import httpRequest from '../../utils/httpRequest';

export const getCurrentUser = async () => {
  const res = await httpRequest.get('/auth/me');
  return res;
};

export const login = async (data) => {
  try {
    const res = await httpRequest.post('/auth/login', data);
    return res;
  } catch (err) {
    console.error('Login thất bại:', err);
    throw err;
  }
};

export const register = async (data) => {
  try {
    const res = await httpRequest.post('/auth/register', data);
    return res;
  } catch (err) {
    console.error('Register thất bại:', err);
    throw err;
  }
};

export const checkEmail = async (data) => {
  try {
    const res = await httpRequest.post('/auth/check-email', data);
    return res?.exists ?? false;
  } catch (err) {
    console.error('Check email thất bại:', err);
    return false;
  }
};

export const sendCode = async (data) => {
  try {
    const res = await httpRequest.post('/auth/send-code', data);
    return res;
  } catch (err) {
    console.error('Quá trình tạo mã otp hoặc gửi mã thất bại:', err);
    return false;
  }
};

export const verifyEmail = async (data) => {
  try {
    const res = await httpRequest.post('/auth/verify-email', data);
    return res;
  } catch (err) {
    console.error('Logout thất bại:', err);
    throw err;
  }
};

export const logout = async () => {
  try {
    const res = await httpRequest.post('/auth/logout');
    return res;
  } catch (err) {
    console.error('Logout thất bại:', err);
    throw err;
  }
};

export default {
  getCurrentUser,
  login,
  register,
  checkEmail,
  sendCode,
  verifyEmail,
  logout,
};
