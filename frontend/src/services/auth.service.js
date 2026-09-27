import apiRequest from "./api.js";
/*
Register.jsx
    ↓
auth.service.js
    ↓
api.js
    ↓
fetch()
    ↓
Backend
*/
export const registerUser = async (userData) => {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const loginUser = (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getCurrentUser = () => {
  return apiRequest("/auth/me", {
    method: "GET",
  });
};

export const logoutUser = () => {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
};

export const editProfile = (userData) => {
  return apiRequest("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(userData),
  });
};