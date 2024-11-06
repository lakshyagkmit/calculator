const redis = require('redis');
require('dotenv').config();
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

module.exports = redisClient;
