import http from 'http'
import { Server } from 'socket.io'
import axios from 'axios';

const PORT = 8080;
export const URI = 'http://localhost:3001/api/v1'

const server = http.createServer()


export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})


//Middleware for authentication
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token

        if (!token) {
            return next(new Error("Authentication Error: Token missing"));
        }

        const response = await axios.get(`${URI}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log({ response })
        socket.data.user = response.data
        next();
    } catch (error) {
        next(new Error("Authentication Error"))
    }
})



//Connection logic

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`)



    //Join Room

    socket.on('joinRoom', async (roomId) => {
        const response = await axios.get(`${URI}/rooms/${roomId}`, {
            headers: {
                Authorization: `Bearer ${socket.handshake.auth.token}`
            }
        })

        console.log({ response })
        socket.join(roomId)
        socket.data.roomId = roomId
        console.log(`${socket.data.user} joined ${roomId}`);

    })


    //Leave room
    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        delete socket.data.roomId;
    });

    //Handle messages
    socket.on('sendMessage', async (message) => {
        console.log('Message received', message)




        io.emit("receiveMessage", message)
    })


    //Disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`)
    })
})



server.listen(PORT, () => {
    console.log(`WS server running on port ${PORT}`)
})