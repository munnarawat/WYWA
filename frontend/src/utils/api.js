import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_MYWA_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = []; 

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (originalRequest.url === "/auth/refresh") {
//           window.location.href = "/login";
//           return Promise.reject(error);
//       }

//       originalRequest._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;

//         try {
//           // Token refresh karo
//           await api.post("/auth/refresh");
//           isRefreshing = false;
//           processQueue(null); 
          
//           return api(originalRequest);
//         } catch (refreshError) {
//           isRefreshing = false;
//           processQueue(refreshError);
//           window.location.href = "/login";
//           return Promise.reject(refreshError);
//         }
//       }
//       return new Promise((resolve, reject) => {
//         failedQueue.push({ resolve, reject });
//       }).then(() => {
//         return api(originalRequest);
//       }).catch((err) => {
//         return Promise.reject(err);
//       });
//     }

//     return Promise.reject(error);
//   }
// );

export default api;