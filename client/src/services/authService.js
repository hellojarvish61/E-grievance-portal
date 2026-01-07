// import api from './api';

// // ========================
// // Register new user
// // ========================
// export const register = async (userData) => {
//   try {
//     const response = await api.post('/auth/register', userData);

//     // Save token and user data to localStorage
//     if (response.data.success) {
//       const { token, ...userInfo } = response.data.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userInfo));
//     }

//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Registration failed' };
//   }
// };

// export const login = async (credentials) => {
//   try {
//     const response = await api.post('/auth/login', credentials);

//     // Save token and user data
//     if (response.data.success) {
//       const { token, ...userInfo } = response.data.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(userInfo));
//     }

//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Login failed' };
//   }
// };

// export const logout = () => {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
//   window.location.href = '/login';
// };

// export const getCurrentUser = () => {
//   try {
//     const userStr = localStorage.getItem('user');

//     // Safely handle invalid values
//     if (!userStr || userStr === 'undefined' || userStr === 'null') {
//       return null;
//     }

//     return JSON.parse(userStr);
//   } catch (error) {
//     console.error('Error parsing user from localStorage:', error);
//     return null;
//   }
// };

// export const isAuthenticated = () => {
//   const token = localStorage.getItem('token');
//   return !!token && token !== 'undefined' && token !== 'null';
// };



import api from "./api";

// REGISTER
export const register = async (userData) => {
  const res = await api.post("/auth/register", userData);

  if (res.data?.data?.token) {
    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data));
  }

  return res.data;
};

// LOGIN
export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);

  if (res.data?.data?.token) {
    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.data));
  }

  return res.data;
};

// LOGOUT
export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

// CURRENT USER
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// AUTH CHECK
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
