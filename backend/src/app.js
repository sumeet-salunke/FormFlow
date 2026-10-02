import express from "express";
import cors from "cors";
import helmet from "helmet";
import sessionConfig from "./config/session.js";

import env from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";
import { globalLimiter } from "./middlewares/rateLimiter.js";
import csrfProtection from "./middlewares/csrfProtection.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import formRoutes from "./routes/form.routes.js";
import responseRoutes from "./routes/response.routes.js";


const app = express();
/**
 * Security middleware
 * 
 * Helmet adds a collection of HTTP security headers.
 * we establish this at the application level so every route receives the baseline security configueation.
 */
app.use(helmet());

/**
 * CORS
 * 
 * The frontend will run seperatly from the backend during development, so the browser needs explicit permission to communicate with ou API.
 */
app.use(cors({
  origin: env.clientUrl,
  credentials: true,
  allowedHeaders: ["Content-Type", "X-Requested-With", "X-FormFlow-Request"],
}));
//request body parsing-> Allow express to read JSON request bodies
app.use(express.json());

//session config
app.use(sessionConfig);
//routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1", globalLimiter);
app.use("/api/v1", csrfProtection);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/forms", formRoutes);
app.use("/api/v1/responses", responseRoutes);


// not found
app.use(notFound);

//centralized error middleware
app.use(errorHandler);

export default app;