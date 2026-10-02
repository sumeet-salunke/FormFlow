import rateLimit from "express-rate-limit";

const createLimiter = (windowMs, limit, message) => {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        error: {
          code: "TOO_MANY_REQUESTS",
          message,
        },
      });
    },
  });
};

/**
 * Global API limiter: generous for normal human and testing workflows
 * (500 requests per 15 minutes per IP).
 */
export const globalLimiter = createLimiter(
  15 * 60 * 1000,
  500,
  "Too many requests from this IP, please try again after 15 minutes."
);

/**
 * Auth limiter: prevents brute-force credential stuffing and registration spam
 * (30 attempts per 15 minutes per IP).
 */
export const authLimiter = createLimiter(
  15 * 60 * 1000,
  30,
  "Too many authentication attempts, please try again after 15 minutes."
);

/**
 * Public response submission limiter: prevents anonymous spam/DoS on public forms
 * (60 submissions per 15 minutes per IP).
 */
export const submissionLimiter = createLimiter(
  15 * 60 * 1000,
  60,
  "Too many form submissions from this IP, please try again later."
);
