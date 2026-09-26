import app from "./app.js";
import env from "./config/env.js";

const startServer = () => {
  app.listen(env.port, () => {
    console.log(`FormFlow is running on http://localhost:${env.port}`);
  })
};

startServer();