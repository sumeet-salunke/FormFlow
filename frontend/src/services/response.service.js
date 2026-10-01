import apiRequest from "./api.js";

export const submitResponse = (publicId, answers) => {
  return apiRequest(`/responses/public/${publicId}`, {
    method: "POST",
    body: JSON.stringify({ answers, }),
  });

};

export const getFormResponses = (formId) => {
  return apiRequest(`/responses/form/${formId}`, {
    method: "GET",
  });
};

export const deleteResponse = (responseId) => {
  return apiRequest(`/responses/${responseId}`, {
    method: "DELETE",
  });
};

export const deleteAllResponses = (formId) => {
  return apiRequest(`/responses/form/${formId}`, { method: "DELETE" });
};

export const getResponse = (responseId) => {
  return apiRequest(`/responses/${responseId}`, {
    method: "GET",
  });
};


export const updateResponse = (responseId, answers) => {
  return apiRequest(`/responses/${responseId}`, {
    method: "PATCH",
    body: JSON.stringify({ answers }),
  });
};

