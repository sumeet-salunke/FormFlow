import "dotenv/config";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  mongoUrl: process.env.MONGO_URI,

  sessionSecret: process.env.SESSION_SECRET,

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

export default env;