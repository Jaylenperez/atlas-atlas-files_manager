import crypto from 'crypto';
const { default: dbClient } = require('../../utils/db');

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

      const hashed = crypto.createHash('sha1').update(password).digest('hex');

      const { insertedId } = await db.collection('users').insertOne({ email, password: hashed });

      return res.status(201).json({ id: insertedId.toString(), email });
    } catch (err) {
      console.error('UsersController.postNew error:', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }
}

const UC = new UsersController();
export default UC;
