import axios from "axios";

//— Axios instance مشترك
const api = axios.create({
  baseURL: "http://localhost:8000",   // غيّرها لو أطلقت على سيرفر آخر
  withCredentials: false,            // true إذا كنت تستخدم Cookies
});

//— Helper: احصل على التوكن المخزّن في الذاكرة (AuthContext)
let getAccessToken = () => null;      // سيتم استبداله من AuthProvider

export const bindTokenGetter = (fn) => {
  // يُنادى عليه من داخل AuthProvider مرة واحدة
  getAccessToken = fn;
};

//— Request interceptor: يضيف Authorization
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//— Response interceptor: يحاول تجديد التوكن لو انتهت صلاحيته
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { config, response } = err;
    if (!response || response.status !== 401 || config._retry) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          config.headers.Authorization = "Bearer " + token;
          return api(config);
        })
        .catch(Promise.reject);
    }

    config._retry = true;
    isRefreshing = true;

    try {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) throw err;

      const { data } = await axios.post(
        "http://localhost:8000/api/users/refresh/",
        { refresh }
      );

      window.dispatchEvent(new CustomEvent("NEW_ACCESS_TOKEN", { detail: data.access }));

      processQueue(null, data.access);
      config.headers.Authorization = "Bearer " + data.access;
      return api(config);
    } catch (e) {
      processQueue(e, null);
      localStorage.removeItem("refresh");
      window.dispatchEvent(new Event("LOGOUT_BY_REFRESH_EXPIRED"));
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
