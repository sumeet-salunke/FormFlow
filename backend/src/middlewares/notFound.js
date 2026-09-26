import ApiError from "../helpers/ApiError.js";
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.url}`, "ROUTE_NOT_FOUND"));
};

export default notFound;