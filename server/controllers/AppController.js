const { default: redisClient } = require("../../utils/redis")
// const { default: dbClient } = require("../../utils/db")

class AppController{
    constructor() {
    }

    getStatus(request, response) {
        if (redisClient.isAlive() === true) {
            return ({"redis": true}, 200)
        }
    }

    // getStats(request, response) {
    //     let users = await dbClient.nbUsers()
    //     let files = await dbClient.nbFiles()
    //     return (200, {"users": users, "files": files})
    // }

}

const AC = new AppController
export default AC
