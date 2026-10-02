import ApiResponse from "../helpers/ApiResponse.js";

const getHealth = (req, res) => {
  const response = new ApiResponse(200, "Server is healthy.", {
    status: "ok",
  });
  return res.status(response.statusCode).json(response);
};

export { getHealth };