import { createClient } from "redis";
import config from './config.js';
const redisClient = createClient({
  url:
    config.REDIS_URL ||
    "redis://redis:6379",
});

redisClient.on(
  "connect",
  () => {
    console.log(
      "Redis Connected"
    );
  }
);

redisClient.on(
  "error",
  (error) => {
    console.error(
      "Redis Error:",
      error
    );
  }
);

export const connectRedis =
  async () => {
    if (
      !redisClient.isOpen
    ) {
      await redisClient.connect();
    }
  };

export default redisClient;