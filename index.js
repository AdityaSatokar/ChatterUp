import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectToDB } from "./configuration/db.config.js";
import { chatModel } from "./schemas/chat.schema.js";

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
});

let clients = [];

io.on("connection",async(socket)=>{
    console.log("connected!!");
    socket.emit("getName");

    socket.on("join",async (name)=>{
        socket.name = name;
        socket.join("some room");
        const id = socket.id;
        clients.push({name:name,id:id});
        const chats = await chatModel.find();
        io.in("some room").emit("joined",clients,chats);
    });

    socket.on("new-chat",async(message,name,hours,minutes,meridiem,date)=>{
        const chat = await new chatModel({name:name,message:message,time:Date(date)});
        await chat.save();
        io.in("some room").emit("chat",message,name,hours,minutes,meridiem);
    });

    socket.on("type",(typing,id)=>{
        io.in("some room").emit("typing",typing,id);
    });

    socket.on("disconnect",()=>{
        const name = socket.name;
        const index = clients.findIndex((client)=>client.name===name);
        console.log(`${clients.splice(index,1)[0].name} disconnected!`);
        io.in("some room").emit("updateStatus",clients);
    });
});

server.listen(5000,()=>{
    connectToDB();
    console.log("server is listening on port 5000!!!");
});