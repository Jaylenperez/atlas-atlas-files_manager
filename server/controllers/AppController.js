import { json } from "express"

const { default: redisClient } = require("../../utils/redis")
const { default: dbClient } = require("../../utils/db")

class AppController{
    constructor() {
    }

    getStatus(request, response) {
        if (redisClient.isAlive() === true && dbClient.isAlive() === true) {
            console.log('Success')
            return JSON.stringify({"redis": true, "db": true}, 200)
        }
        else{
            console.log("Somethings Not working here")
        }
    }

    getStats(request, response) {
        let users = dbClient.nbUsers()
        let files = dbClient.nbFiles()
        console.log('Success stats')
        return JSON.stringify({"users": users, "files": files}, 200)
    }

}

const AC = new AppController
export default AC
