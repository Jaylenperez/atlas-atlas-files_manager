const { default: redisClient } = require("../../utils/redis")
const { default: dbClient } = require("../../utils/db")
const req = require('request')
const sha1 = require("sha1")
const uuidv4 = require('uuid')

const string = "jelpp"
class AuthController {
    constructor() {
    }
    async getConnect(req,res) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')){
            return res.status(401).json({error: 'Unauthorized'})
        }
            const encoded = authHeader.split(' ')[1]
            const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
            const [email, password] = decoded.split(':')

            if (!email || !password) {
                return res.status(401).json({error : 'Unauthorized'})
            }

            const hashedPass = sha1(password)

            try {
                const user = await dbClient.getDB().collection('users').findOne({email, password: hashedPass })

                if (!user) {
                    return res.status(401).json({error : 'Unauthorized'})
                }

                const token = uuidv4();
                const key = `auth_${token}`

                await redisClient.set(key, user._id.toString(), 24 * 60 * 60);

                return res.status(200).json({ token })
            } catch (error) {
                console.error('Error', error)
                return res.status(500).json({error: 'Internal error'})
            }
        }

    getDisconnect(req,res) {
        console.log('Get Disconnect')
    }

}

const AuthControl = new AuthController
export default AuthControl
