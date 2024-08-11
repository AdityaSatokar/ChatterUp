import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const baseUrl = process.env.DB || "0.0.0.0:27017";
export const connectToDB=async()=>{
    try{
        await mongoose.connect(`mongodb://${baseUrl}/chatterUp`);
        console.log("connected to database using mongoose!");  
    }catch(err){
        console.log(err);
    }
}