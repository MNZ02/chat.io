import http from 'http'
import { Server } from 'socket.io'
import { authMiddleware } from './middlewares/authMiddleware'
import axios from 'axios'
import { URI, PORT } from './config'
import { joinRoom, leaveRoom } from './handlers/room'
import { sendMessage } from './handlers/message'

const server = http.createServer()


const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})


//Authenticate middleware

io.use(authMiddleware)


//Websocket events
io.on('connection', async (socket) => {
    console.log(`User connected ${socket.id}`)
    const token = socket.data.token;
    const userId = socket.data.user.id;


    //Fetch user chats on inital connection

    try {
        const response = await axios.get(`${URI}/chats`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const chats = response.data.chats
        if (!Array.isArray(chats) || chats.length === 0) {
            console.log(`User ${userId} has no chats`);
            return;
        }


        chats.forEach((chat) => socket.join(chat.id))
        console.log(`User ${userId} joined ${chats.length} rooms`)


    } catch (error: any) {
        console.error('Error getting user chats', error?.message)
        throw new Error('Error getting user chats')
    }


    //chat events
    socket.on('joinRoom', (roomId) => joinRoom(socket, roomId))
    socket.on('leaveRoom', (roomId) => leaveRoom(socket, roomId))

    //sendMessage
    socket.on('sendMessage', (message) => sendMessage(socket, message))



    //Disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`)
    })
})

server.listen(PORT, () => {
    console.log(`WS server running on port ${PORT}`)
})

