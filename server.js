import express from "express"
import dotenv from "dotenv"
import connection from "./db/connection.js"
import router from "./routes/router.js"
import swaggerUi from "swagger-ui-express";
import swagger from "./docs/swagger.json" with { type: "json" };
import cors from "cors"

dotenv.config()

const app = new express()

app.use(express.json())
app.use( router )
// cors
const corsOptions = {
    origin: ['http://localhost:3000', 'https://iro-employee-bn.onrender.com/'], // Add your deployed URL
    credentials: true, // Allow credentials like cookies
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'UPDATE', 'DELETE'],
};
app.use( cors() )

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));





app.listen(process.env.PORT,async ()=>{
    if(connection){
        await connection
        console.log("App is running on port", process.env.PORT)
        return
    }
    return console.log("app Not running")
})