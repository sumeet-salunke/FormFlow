import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";

import formService from "../services/form.service.js";


export const createForm = asyncHandler(async (req, res) => {
  const result = await formService.createForm(req.userId, req.body);

  return res.status(201).json(new ApiResponse(201, result.message, result.data));

});

export const getMyForms = asyncHandler(async (req, res) => {
  const result = await formService.getMyForms(req.userId);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const updateForm = asyncHandler(async (req, res) => {
  const result = await formService.updateForm(req.userId, req.params.formId, req.body);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const getForm = asyncHandler(async (req, res) => {
  const result = await formService.getForm(
    req.params.formId,
    req.userId
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result.message,
        result.data
      )
    );
});

export const publishForm = asyncHandler(async (req, res) => {
  const result = await formService.publishForm(req.userId, req.params.formId);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const getPublicForm = asyncHandler(async (req, res) => {
  const result = await formService.getPublicForm(req.params.publicId);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});