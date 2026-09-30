import apiRequest from "./api.js";

export const getPublicForm = (publicId) => {
  return apiRequest(`/forms/public/${publicId}`, {
    method: "GET"
  });
};