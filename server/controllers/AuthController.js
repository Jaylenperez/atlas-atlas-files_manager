const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const {default : dbClient} = require('../../utils/db'); // Adjust based on your ORM / user model
const {default: redisClient} = require('../../utils/redis'); // Your redis client instance

class AuthController{
    constructor () {

    }
  async getConnect (req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      console.log(credentials)
      const [email, password] = credentials.split(':');
      console.log(email, password)

      if (!email || !password) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find user with matching email and SHA1(password)
      const hashedPassword = sha1(password);

      console.log(hashedPassword)
      const user = await dbClient.db.collection('users').findOne({ email, password: hashedPassword });
      console.log('user Found', user._id)

      if (!user) {
        return res.status(401).json({ error: 'No User' });
      }

      // Generate a token and store it in Redis for 24h (86400 seconds)
      const token = uuidv4();
      console.log('Token', token)
      const redisKey = `auth_${token}`;
      console.log('Redis key', redisKey)
      const setter = async () => {
        try
        {await redisClient.set(redisKey, user._id.toString(), 86400,);}
        catch (error) { console.error(error, 'hello')}
    }

      setter()

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
}

    async getDisconnect (req, res) {
    try {
      const token = req.headers['x-token'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const redisKey = `auth_${token}`;
      const userId = await redisClient.get(redisKey);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      let del = await redisClient.del(redisKey);
      return res.status(204).send(del);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const AC = new AuthController
export default AC
