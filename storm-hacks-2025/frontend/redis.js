// redis.js or db/redis.js
import { createClient } from 'redis';

const redisClient = createClient({
  url: 'redis://localhost:6379', // or your Redis URL
  // For Redis Cloud or remote:
  // url: 'redis://username:password@host:port'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

// Connect to Redis
await redisClient.connect();

export default redisClient;