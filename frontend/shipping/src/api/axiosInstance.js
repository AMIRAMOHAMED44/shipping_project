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

// تكوين axios instance
const axiosInstance = axios.create({
  baseURL: '/api/', // استخدام proxy بدل localhost مباشر
  timeout: 10000, // حد زمني 10 ثواني للطلب
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// دالة مساعدة للتحقق من انتهاء صلاحية التوكن
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// interceptor للطلبات الصادرة
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access');
    
    // إذا كان التوكن منتهي الصلاحية
    if (accessToken && isTokenExpired(accessToken)) {
      localStorage.removeItem('access');
      window.location.href = '/login?session_expired=true';
      return Promise.reject(new Error('Token expired'));
    }
    
    // إضافة التوكن للطلبات إذا موجود
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// interceptor للردود الواردة
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // التعامل مع أخطاء 401 (غير مصرح)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh');
      
      // إذا لا يوجد refresh token
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login?session_expired=true';
        return Promise.reject(error);
      }
      
      try {
        
        // محاولة تجديد التوكن
        const response = await axios.post('/api/users/refresh/', { 
          refresh: refreshToken 
        });
        
        const newAccessToken = response.data.access;
        localStorage.setItem('access', newAccessToken);
        
        // تحديث التوكن في headers
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        // إعادة الطلب الأصلي بالتوكن الجديد
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // إذا فشل تجديد التوكن
        localStorage.clear();
        
        // تحديد رسالة الخطأ المناسبة
        let redirectUrl = '/login?session_error=true';
        if (refreshError.response?.status === 403) {
          redirectUrl = '/login?session_invalid=true';
        }
        
        window.location.href = redirectUrl;
        return Promise.reject(refreshError);
      }
    }
    
    // إذا كان الخطأ ليس 401 أو تمت المحاولة بالفعل
    return Promise.reject(error);
  }
);

export default axiosInstance;