import ApiResponse from "../helpers/ApiResponse.js";
import responseService from "../services/response.service.js";
import asyncHandler from "../helpers/asyncHandler.js";

export const submitResponse = asyncHandler(async (req, res) => {
  const result = await responseService.submitResponse(req.params.publicId, req.body.answers);
  return res.status(200).json(new ApiResponse(200, result.message, result.data));
});