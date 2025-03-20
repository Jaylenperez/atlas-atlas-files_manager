const redis = require('redis')

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    if (!this.client.connected) {
      this.client.on('connect', () => {
        console.log('Redis client connected', this.client.connected);
      });
    } else {
      console.log('Redis client is already connected');
    }
  }

  isAlive() {
    return this.client.isReady;
  }

  async get(key) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.client.get(key, (err, reply) => {
          if (err) {
            reject(err);
          } else {
            resolve(reply);
          }
        });
      });

      if (result === null) {
        return false;
      }

      return `${result}`;
    } catch (err) {
      console.error(`Redis GET error for key ${key}: ${err}`);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.setex(key, duration, value);
      return 'OK'; // Consistent with Redis
    } catch (err) {
      console.error(`Redis SETEX error for key ${key}: ${err}`);
      return null;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
      return 1; // Consistent with Redis
    } catch (err) {
      console.error(`Redis DEL error for key ${key}: ${err}`);
      return 0;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;
