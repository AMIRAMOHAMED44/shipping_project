// import axios from 'axios';

// const baseURL = 'http://localhost:8000/api/';

// const axiosInstance = axios.create({
//   baseURL,
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem('access')}`,
//     'Content-Type': 'application/json',
//     Accept: 'application/json',
//   },
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const refresh = localStorage.getItem('refresh');
//       if (!refresh) {
//         localStorage.clear();
//         window.location.href = '/login';
//         return Promise.reject(error);
//       }

//       try {
//         const response = await axios.post(`${baseURL}token/refresh/`, { refresh });
//         const newAccess = response.data.access;
//         localStorage.setItem('access', newAccess);

//         axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;
//         originalRequest.headers.Authorization = `Bearer ${newAccess}`;

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         localStorage.clear();
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
import axios from 'axios';

const baseURL = 'http://localhost:8000/api/';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access');
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh');
      if (!refresh) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      try {
        const response = await axios.post(`${baseURL}users/refresh/`, { refresh });
        const newAccess = response.data.access;
        localStorage.setItem('access', newAccess);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;