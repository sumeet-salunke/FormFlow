import "./config/dns.js";
import app from "./app.js";
import env from "./config/env.js";
import connectMongoDB from "./databases/mongo.js";


const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(env.port, () => {
      console.log(`FormFlow is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();