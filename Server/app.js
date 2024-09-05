import http from 'http'
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';
import userRouter from './src/interface/routes/user';
import adminRouter from './src/interface/routes/admin';
import dbConnection from './src/adapters/database';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { getUser, removeUser, addUser } from './src/adapters/utils/socketServer';
const app = express();
const server = http.createServer(app)
dotenv.config({ path: path.resolve(__dirname, '.env') });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}))
app.use(cookieParser())
app.use(bodyParser.json());

app.use('/', userRouter)
app.use('/admin', adminRouter)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})
io.on("connection", (socket) => {
    console.log('user connected', socket.id)
    socket.on("addUser", (userId) => {
        const user = addUser(userId, socket.id)
        io.emit("getUsers", user)
    })


    socket.on("sendMessage", ({ senderId, recieverId, text }) => {
        const user = getUser(recieverId)
        io.to(user?.socketId).emit("getMessage", {
            senderId,
            text
        })

    })

    socket.on("disconnect", () => {
        console.log('user disconnected')
        const user = removeUser(socket.id)
        io.emit("getUsers", user)
    })
})
dbConnection()
server.listen(3000, () => {
    console.log('Server Running....')
})

