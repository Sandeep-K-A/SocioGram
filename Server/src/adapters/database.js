import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const dbconnectionString = process.env.DATABASE_CONNECTION
const dbConnection = () => {
    mongoose.connect(dbconnectionString, {
        dbName: 'SocioGram',
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Database connected successfully...")
    }).catch((error) => {
        console.log(`Database connection failed ${error.message}`)
    })
}

export default dbConnection;