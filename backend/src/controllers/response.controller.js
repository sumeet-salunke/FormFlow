import ApiResponse from "../helpers/ApiResponse.js";
import responseService from "../services/response.service.js";
import asyncHandler from "../helpers/asyncHandler.js";

export const submitResponse = asyncHandler(async (req, res) => {
  const result = await responseService.submitResponse(req.params.publicId, req.body.answers);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const getFormResponses = asyncHandler(async (req, res) => {
  const result = await responseService.getFormResponses(req.userId, req.params.formId);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const deleteResponse = asyncHandler(async (req, res) => {
  const result = await responseService.deleteResponse(req.userId, req.params.responseId);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});

export const deleteAllResponses = asyncHandler(async (req, res) => {
  const result = await responseService.deleteAllResponses(req.userId, req.params.formId);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});