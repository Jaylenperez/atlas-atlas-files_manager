import { error } from 'console';

const { default: dbClient, ObjectId } = require('../../utils/db');
const { default: redisClient } = require('../../utils/redis')
const { v4: uuidv4 } = require('uuid');

class FilesController {
    constructor () {
    }

    async postUpload(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
          return res.status(401).json({ error: 'No token' });
        }

        const db = dbClient.getDB();
        if (!db) {
          return res.status(500).json({ error: 'No connection' });
        }

        const redisKey = `auth_${token}`;
        const userId = await redisClient.get(redisKey);
        if (!userId) {
          return res.status(401).json({ error: 'No user Id' });
        }
        const { name, type, parentId, isPublic, data} = req.body
        const acceptedTypes = ['folder', 'file', 'image']

        if (!name) {
            return res.status(400).json({error: 'Missing name'})
        }

        if (!type || !acceptedTypes) {
            return res.status(400).json({error: 'Missing name'})
        }

        if (!data && type != 'folder') {
            return res.status(400).json({error: 'Missing data'})
        }
        if (parentId && !ObjectId.isValid(parentId)) {
            return res.status(400).json({error: 'Parent not found'})
        }
        if (parentId && type !== 'folder') {
           const parentFile = await db.collections('files').findOne({_id: ObjectId(parentId), type: 'folder'});
           if (!parentFile) {
            return res.status(400).json({error: 'Parent not found'})
           }
        }

        const newFile = {
            userId,
            name,
            type,
            isPublic: isPublic ?? false,
            parentId: parentId ? ObjectId(parentId) : 0,
            localPath: ''
        };
        try {
            const result = await db.collection('files').insertOne(newFile);
            newFile._id = result.insertedId;

            if (type !== 'folder') {
              const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
              const fileName = uuidv4();
              const filePath = `${folderPath}/${fileName}`;

              // Create the directory if it doesn't exist
              require('fs').mkdirSync(folderPath, { recursive: true });

              // Save the file
              require('fs').writeFileSync(filePath, data, 'base64');

              newFile.localPath = filePath;
            }

            return res.status(201).json(newFile.toString());
          } catch (error) {
            console.error('Error in FilesController.postUpload:', error);
            return res.status(500).json({ error: 'Internal server error' });
          }
    }
}

const FilesControl = new FilesController
export default FilesControl
