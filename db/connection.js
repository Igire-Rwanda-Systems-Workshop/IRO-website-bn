import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()


const connection = mongoose.connect(process.env.MONGODB_URLS).then(()=>{
    return console.log("Database connected")
}).catch(error=>{
    return console.log(error.message)
})

export default connection