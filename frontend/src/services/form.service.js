import apiRequest from "./api.js";

export const createForm = (formData) => {
  return apiRequest("/forms", {
    method: "POST",
    body: JSON.stringify(formData),
  });
};

export const getMyForms = () => {
  return apiRequest("/forms", {
    method: "GET"
  });
};

export const updateForm = (formId, formData) => {
  return apiRequest(`/forms/${formId}`, {
    method: "PATCH",
    body: JSON.stringify(formData),
  });
};

export const getFormById = (formId) => {
  return apiRequest(`/forms/${formId}`);
};

export const updateFormStatus = (formId, status) => {
  return apiRequest(`/forms/${formId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const publishForm = (formId) => {
  return apiRequest(`/forms/${formId}/publish`, {
    method: "POST",
  });
};