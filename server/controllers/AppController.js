import { json } from "express"

const { default: redisClient } = require("../../utils/redis")
const { default: dbClient } = require("../../utils/db")

class AppController{
    constructor() {
    }

    async getStatus(request, response) {
      try {
        const redis = await redisClient.isAlive()
        const db = await dbClient.isAlive()
        console.log('Success')
        return {redis, db}
        }
        catch (error) {
            console.error('Error', error)
        }
    }

     async getStats(request, response) {
        try {
        const users = await dbClient.nbUsers()
        const files = await dbClient.nbFiles()
        console.log('Success stats')
        return {users, files}
    }   catch (error) {
        console.error('Error', error)
        return {users: 0, files: 0}
    }
}}

const AC = new AppController
export default AC
