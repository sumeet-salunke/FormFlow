const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      code: err.code || "INTERNAL SERVER ERROR",
      message: err.message || "Something went wrong",

    },
  };
  if (err.details) {
    response.error.details = err.details;
  }
  if (process.env.NODE_ENV != "production") {
    response.error.stack = err.stack;
  }
  res.status(statusCode).json(response);
};

export default errorHandler;