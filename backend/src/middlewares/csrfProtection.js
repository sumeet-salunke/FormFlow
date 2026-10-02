import ApiError from "../helpers/ApiError.js";
import env from "../config/env.js";

/**
 * CSRF Protection Middleware
 *
 * Protects state-changing authenticated requests against Cross-Site Request Forgery.
 * Verifies that:
 * 1. Request Origin/Referer matches the configured clientUrl when present.
 * 2. Custom header (X-Requested-With or X-FormFlow-Request) is present on state-changing API calls.
 */
const csrfProtection = (req, res, next) => {
  // Safe HTTP methods do not change state
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // Exempt unauthenticated public endpoints
  const fullPath = req.originalUrl || req.path || "";
  const isPublicAuth =
    fullPath.includes("/auth/register") ||
    fullPath.includes("/auth/login");
  const isPublicSubmission = fullPath.includes("/responses/public/");

  if (isPublicAuth || isPublicSubmission) {
    return next();
  }

  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const clientOrigin = new URL(env.clientUrl).origin;

  // Verify Origin if present
  if (origin) {
    try {
      const requestOrigin = new URL(origin).origin;
      if (requestOrigin !== clientOrigin) {
        throw new ApiError(403, "Cross-site request blocked: untrusted origin.", "CSRF_ERROR");
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(403, "Invalid request origin.", "CSRF_ERROR");
    }
  } else if (referer) {
    try {
      const requestRefererOrigin = new URL(referer).origin;
      if (requestRefererOrigin !== clientOrigin) {
        throw new ApiError(403, "Cross-site request blocked: untrusted referer.", "CSRF_ERROR");
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(403, "Invalid request referer.", "CSRF_ERROR");
    }
  }

  // Verify custom header for state-changing requests
  const hasCustomHeader =
    req.headers["x-requested-with"] === "XMLHttpRequest" ||
    req.headers["x-formflow-request"] === "true";

  if (!hasCustomHeader) {
    throw new ApiError(403, "Missing required security header.", "CSRF_ERROR");
  }

  next();
};

export default csrfProtection;
