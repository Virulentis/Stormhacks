const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());

// Connect to Redis (use 'redis' as hostname - Docker service name)
const redisClient = redis.createClient({
  socket: {
    host: 'redis',  // This matches the service name in docker-compose.yml
    port: 6379
  }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Connected to Redis'));

(async () => {
  await redisClient.connect();
})();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all key-value pairs
app.get('/api/data', async (req, res) => {
  try {
    const keys = await redisClient.keys('*');
    
    const data = await Promise.all(
      keys.map(async (key) => {
        const value = await redisClient.get(key);
        try {
          return { key, value: JSON.parse(value) };
        } catch {
          return { key, value };
        }
      })
    );
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific key
app.get('/api/data/:key', async (req, res) => {
  try {
    const value = await redisClient.get(req.params.key);
    if (value === null) {
      return res.status(404).json({ error: 'Key not found' });
    }
    try {
      res.json(JSON.parse(value));
    } catch {
      res.json({ value });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get keys matching a pattern
app.get('/api/keys/:pattern', async (req, res) => {
  try {
    const keys = await redisClient.keys(req.params.pattern);
    const data = await Promise.all(
      keys.map(async (key) => {
        const value = await redisClient.get(key);
        try {
          return { key, value: JSON.parse(value) };
        } catch {
          return { key, value };
        }
      })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});