import axios from 'axios';

let isRefreshing = false;
let tokenListeners = [];

const httpRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// httpRequest.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// httpRequest.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const refreshToken = localStorage.getItem('refresh_token');
//     const shouldRenewToken = error.response?.status === 401 && refreshToken;
//     if (shouldRenewToken) {
//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           const res = await axios.post(
//             `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
//             {
//               refresh_token: refreshToken,
//             }
//           );
//           const data = res.data.data;

//           localStorage.setItem('token', data.access_token);
//           localStorage.setItem('refresh_token', data.refresh_token);

//           tokenListeners.forEach((listener) => listener());
//           isRefreshing = false;
//           tokenListeners = [];
//           return httpRequest(error.config);
//         } catch (error) {
//           localStorage.removeItem('token');
//           localStorage.removeItem('refresh_token');
//           isRefreshing = false;
//           tokenListeners = [];
//         } finally {
//           // isRefreshing = false;
//           // tokenListeners = [];
//         }
//       } else {
//         return new Promise((resolve) => {
//           tokenListeners.push(() => {
//             resolve(httpRequest(error.config));
//           });
//         });
//       }
//     }
//     return Promise.reject(error);
//   }
// );

httpRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const shouldRefresh =
      error.response?.status === 401 &&
      !error.config._retry &&
      !error.config.url.includes('/auth/refresh-token');

    if (shouldRefresh) {
      error.config._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Gửi refresh token từ cookie
          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          tokenListeners.forEach((callback) => callback());
          tokenListeners = [];
          return httpRequest(error.config); // Gửi lại request cũ
        } catch (refreshError) {
          console.error('Refresh token thất bại:', refreshError);
          throw refreshError;
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        tokenListeners.push(() => resolve(httpRequest(error.config)));
      });
    }

    return Promise.reject(error);
  }
);

const send = async (method, url, data, config) => {
  const isPutOrPatch = ['put', 'patch'].includes(method.toLowerCase());
  const effectiveMethod = isPutOrPatch ? 'post' : method;
  const effectivePath = isPutOrPatch
    ? `${url}${url.includes('?') ? '&' : '?'}_method=${method}`
    : url;

  const response = await httpRequest.request({
    method: effectiveMethod,
    url: effectivePath,
    data,
    ...config,
  });
  return response.data;
};

export const get = (url, config) => {
  return send('get', url, null, config);
};

export const post = (url, data, config) => {
  return send('post', url, data, config);
};

export const put = (url, data, config) => {
  return send('put', url, data, config);
};

export const patch = (url, data, config) => {
  return send('patch', url, data, config);
};

export const del = (url, config) => {
  return send('delete', url, null, config);
};

// export const setToken = (token, refresh_token) => {
//   localStorage.setItem('token', token);
//   localStorage.setItem('refresh_token', refresh_token);
//   return;
// };

export default {
  get,
  post,
  put,
  patch,
  del,
};
