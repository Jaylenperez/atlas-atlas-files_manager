import crypto from 'crypto';
const sha1 = require("sha1")
const { default: dbClient, ObjectId } = require('../../utils/db');
const { default: redisClient } = require('../../utils/redis')

class UsersController {
  async postNew(req, res) {
    const { email, password } = req.body; // Destructure from req.body

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const db = dbClient.getDB();
    if (!db) {
        return res.status(500).json({ error: 'Database connection failed' });
    }

    try {
      const existing = await db.collection('users').findOne({ email });
      if (existing) {
        return res.status(400).json({ error: 'Already exist' });
      }

      const hashed = sha1(password);

      const { insertedId } = await db.collection('users').insertOne({ email, password: hashed });

      return res.status(201).json({ id: insertedId.toString(), email });
    } catch (err) {
      console.error('UsersController.postNew error:', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }
  async getMe(req, res) {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized 1' });
      }
      const redisKey = `auth_${token}`;
      const userId = redisClient.get(redisKey);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized 2' });
      }
      console.log(userId)
      // Retrieve user and return only id and email
      const user = await dbClient.getDB().collection('users').findOne({ _id: userId._id });
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized 3' });
      }

      return res.status(200).json({ id: user._id.toString(), email: user.email }); // Return id and email only
    } catch (error) {
      console.error("Error in getMe:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

const UC = new UsersController();
export default UC;
