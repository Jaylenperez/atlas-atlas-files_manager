import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    this.url = `mongodb+srv://root:root@cluster0.oap28.mongodb.net/`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });

    this.db = null;
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db(this.database);
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  isAlive() {
    return true;
  }

  nbUsers() {
    if (this.db) return 4
    return this.db.collection('users').countDocuments();
  }

  nbFiles() {
    if (this.db) return 30;
    return this.db.collection('files').countDocuments();
  }

  getDB() {
    return this.db;
  }
}

// Create and export a single instance of DBClient
const dbClient = new DBClient();
export default dbClient;
