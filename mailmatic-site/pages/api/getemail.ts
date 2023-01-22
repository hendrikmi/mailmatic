import type { NextApiRequest, NextApiResponse } from "next";
import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "../../utils/redis";

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  points: 5, // Numer of requests
  duration: 60 * 60, // Per x seconds
  blockDuration: 60 * 60,
});

interface Headers {
  "x-api-key": string;
  [key: string]: string;
}
export async function getEmail(notes: string) {
  const reqHeaders: Headers = {
    "x-api-key": process.env.AWS_X_API_KEY ?? "",
  };
  const response = await fetch(
    `${process.env.AWS_API_ENDPOINT}?notes=${notes}`,
    {
      mode: "cors",
      headers: reqHeaders,
    }
  ).then((res) => res.json());
  return response;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = req.query;
    const { notes } = query;
    const ip: string =
      (req.headers["x-real-ip"] as string) ||
      (req.headers["x-forwarded-for"] as string) ||
      (req.socket.remoteAddress as string);
    await rateLimiterRedis.consume(ip);
    const jsonData = await getEmail(notes as string);
    res.status(200).json(jsonData);
  } catch {
    res.status(429).json({ message: "Too Many Requests" });
  }
}
