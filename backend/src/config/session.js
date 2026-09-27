import cookieSession from "cookie-session";
import env from "./env.js";

const sessionConfig = cookieSession({
  name: "formflow_session",

  keys: [env.sessionSecret],
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
});

export default sessionConfig;