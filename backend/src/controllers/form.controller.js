import ApiResponse from "../helpers/ApiResponse.js";
import asyncHandler from "../helpers/asyncHandler.js";

import formService from "../services/form.service.js";


export const createForm = asyncHandler(async (req, res) => {
  const result = await formService.createForm(req.userId, req.body);

  return res.status(201).json(new ApiResponse(201, result.message, result.data));

});