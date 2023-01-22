import Redis from "ioredis";

const redisConnectionString = `redis://${process.env.REDIS_USER}:${process.env.REDIS_PW}@${process.env.REDIS_URL}`;

const redisClient = new Redis(redisConnectionString, {
  enableOfflineQueue: true,
});

export default redisClient;
