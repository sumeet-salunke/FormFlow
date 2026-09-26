import express from "express";
import cors from "cors";
import helmet from "helmet";

import env from "./config/env.js";
import healthRoutes from "./routes/health.routes.js";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

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
}));
//request body parsing-> Allow express to read JSON request bodies
app.use(express.json());

//routes
app.use("/api/v1/health", healthRoutes);

// not found
app.use(notFound);

//centralized error middleware
app.use(errorHandler);

export default app;