import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

api.interceptors.request.use(async (config) => {
  const access = localStorage.getItem("access");
  config.headers.Authorization = access ? `Bearer ${access}` : "";
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("refresh")
    ) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");
      try {
        const response = await api.post(
          "http://localhost:8000/api/users/refresh/",
          { refresh: refresh }
        );
        console.log(response);

        localStorage.setItem("access", response.data.access);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = `/login`;
      }
    }
    return Promise.reject(error);
  }
);
export default api;
