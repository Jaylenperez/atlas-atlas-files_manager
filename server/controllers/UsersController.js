// crypto module for hashing passwords using SHA1.
import crypto from 'crypto';
const {default : dbClient} = require('../../utils/db')

class UsersController {
    async postNew(req, res) {
    // Destructure email and password from the request body.
    const { email, password } = req.body;

    // If email is missing return status 400
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    // If password is missing return status 400
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Get the database connection from our dbClient.
    const db = dbClient.getDB();
    try {
      // Check if a user with the provided email already exists in the "users" collection.
      const existing = await db.collection('users').findOne({ email });
      if (existing) {
        // If the email is already registered, return a 400 error with error message.
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the provided password using SHA1 to store it securely.
      const hashed = crypto.createHash('sha1').update(password).digest('hex');

      // Insert the new user into the "users" collection with the email and hashed password.
      const { insertedId } = await db.collection('users').insertOne({ email, password: hashed });

      // Respond with a 201 status and a JSON containing the new user's id and email.
      // insertedId is converted to string if necessary.
      return res.status(201).json({ id: insertedId.toString(), email });
    } catch (err) {
      // If an error occurs during the process, log it and respond with a 500 status.
      console.error('UsersController.postNew error:', err);
      return res.status(500).json({ error: 'Internal error' });
    }
  }
}

// Export the UsersController class so that it can be used in our routing.
export default UsersController;
