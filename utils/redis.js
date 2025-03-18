import { createClient } from 'redis';

class RedisClient {
  constructor() {
    // Create Client
    this.client = createClient();

    // Success Message
    this.client.on('connect', () => {
      console.log('Connected Successfully to Redis');
    });

    // Error Message
    this.client.on('error', (err) => {
      console.error(`Redis Client Error: ${err}`);
    });

  }



  // Returns true when Redis connection successful
  isAlive() {
    return this.client.connected;
  }

  // Returns Redis value stored for given key
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Stores key value pairs and their expiration
  async set(key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.setex(key, duration, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  // Removes a key value pair
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

// Export a single instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
