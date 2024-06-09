import mongoose from 'mongoose';
import colors from "colors";
import { DB_NAME } from '../constants.js';

export const ConnectDB = async() => {
    try {
        const connectionRes = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        // console.log(connectionRes);
        console.log(`MongoDB Connected : ${connectionRes.connection.host}`.bgMagenta.bold);
    } catch (error) {
        console.log("MongoDB Connection Error : ".bgRed.bold, error);
        process.exit(1);
    }
}

