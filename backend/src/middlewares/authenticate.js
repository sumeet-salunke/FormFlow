import ApiError from "../helpers/ApiError.js";
import AUTH from "../constants/auth.constants.js";

const authenticate = (req, res, next) => {
  const userId = req.session?.userId;
  if (!userId) {
    throw new ApiError(401, AUTH.MESSAGES.UNAUTHORIZED, AUTH.CODES.UNAUTHORIZED);
  }
  req.userId = userId;
  next();
};

export default authenticate;