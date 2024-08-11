import mongoose, { Mongoose, mongo } from "mongoose";

const chatSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        required:true
    }
});

export const chatModel = mongoose.model("Chat",chatSchema);