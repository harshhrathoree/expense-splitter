import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import config from "./src/config/config.js";

import { connectRedis } from "./src/config/redis.js";

const startServer = async () => {
  try {
    await connectDB();

    await connectRedis();

    app.listen(
      config.PORT,
      () => {
        console.log(
          `Server is running on port ${config.PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();