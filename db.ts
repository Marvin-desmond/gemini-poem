import { MongoClient } from "mongodb"
import { ENVS } from "./envs"

const mongoConnection = () => {
    const mongoClient = new MongoClient(ENVS.MONGODB_URI!)
    return mongoClient.connect()
}

export default mongoConnection
