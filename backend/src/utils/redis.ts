import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error: ", err);
});

redisClient.on("end", () => {
  console.warn("Redis client disconnected. Attempting to reconnect...");
  tryConnect();
});

const tryConnect = (async () => {
  try {
    await redisClient.connect();
    console.info("Redis client connected");
  } catch (error) {
    console.error("Failed to connect to Redis: ", error, "\nRetrying in 5s.");
    setTimeout(() => {
      tryConnect();
    }, 5000);
  }
});

tryConnect();

export default redisClient;
