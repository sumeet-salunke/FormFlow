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