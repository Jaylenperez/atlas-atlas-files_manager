import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    // Include the database name in the connection URL
    this.url = `mongodb+srv://root:root@cluster0.oap28.mongodb.net/files_manager?retryWrites=true&w=majority`; // Replace placeholders
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });

    this.db = null;
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      // The database is already specified in the URL, so no need to pass it here.
      this.db = this.client.db();
      console.log(`Connected to MongoDB database: ${this.db.databaseName}`);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
    }
  }

  isAlive() {
    return !!this.db && !!this.client && this.client.topology && this.client.topology.isConnected();
  }

 nbUsers() {
    if (!this.db) return 0; // Return 0 if not connected
    try {
    const count = this.db.collection('users').countDocuments();
    return count
    } catch (error) {
      console.error('Error counting users:', error);
      return 0; // Return 0 on error
    }
  }

   nbFiles() {
    if (!this.db) return 0; // Return 0 if not connected
    try {
      const files = this.db.collection('files').countDocuments();
      return files
    } catch (error) {
      console.error('Error counting files:', error);
      return 0; // Return 0 on error
    }
  }

  getDB() {
    return this.db;
  }
}

// Create and export a single instance of DBClient
const dbClient = new DBClient();
export default dbClient;
