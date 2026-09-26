import ApiResponse from "../helpers/ApiResponse.js";

const getHealth = (req, res) => {
  const response = new ApiResponse(200, {
    status: "ok",
  }, "Server is healthy.");
  return res.status(response.statusCode).json(response);
};

export { getHealth };