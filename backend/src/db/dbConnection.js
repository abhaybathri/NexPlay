import mongoose from "mongoose"
import dns from "dns"
import { dbName } from "../constants/dbName.js"

// Force Node.js to use Google DNS
dns.setDefaultResultOrder('ipv4first')
dns.setServers(['8.8.8.8', '8.8.4.4'])

export const dbConnection = async function(){
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${dbName}`)
        console.log(`MongoDB connected! Host: ${connectionInstance.connection.host}`)
        return connectionInstance
    } catch (error) {
        console.log("url of mongodb connection string is ",process.env.MONGO_DB_URI,dbName);
        
        console.log("Mongodb Connection failed ",error)
        process.exit(1)
    }
    
}