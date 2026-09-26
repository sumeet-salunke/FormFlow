import "./config/dns.js";
import app from "./app.js";
import env from "./config/env.js";
import connectMongoDB from "./databases/mongo.js";


const startServer = () => {
  connectMongoDB();
  app.listen(env.port, () => {
    console.log(`FormFlow is running on http://localhost:${env.port}`);
  })
};

startServer();