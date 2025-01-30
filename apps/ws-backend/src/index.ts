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
        const authHeader = socket.handshake.query.query;
        const token = socket.handshake.auth?.token || authHeader

        if (!token) {
            return next(new Error("Authentication Error: Token missing"));
        }

        const response = await axios.get(`${URI}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(response.data)
        socket.data.user = response.data
        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        next(new Error("Authentication Error"))

    }
})



//Connection logic

io.on('connection', async (socket) => {
    console.log(`User connected ${socket.id}`)

    const authHeader = socket.handshake.query;


    //Fetch user connections
    try {
        const response = await axios.get(`${URI}/chats`, {
            headers: {
                Authorization: `Bearer ${authHeader.query}`
            }
        })
        console.log(response.data)

    } catch (error) {
        console.error('Error fetching user connections', error)
    }



    //Join Room

    // socket.on('joinRoom', async (roomId) => {
    //     try {

    //         const response = await axios.get(`${URI}/rooms/${roomId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${socket.handshake.auth.token}`
    //             }
    //         })

    //         console.log({ response })
    //         if (!response.data) {
    //             return socket.emit("error", { message: "Room not found" });
    //         }

    //         socket.join(roomId)
    //         socket.data.roomId = roomId
    //         console.log(`${socket.data.user} joined ${roomId}`);


    //         //Notify team members
    //         io.to(roomId).emit('User joined', { userId: socket.data.user.id })

    //     } catch (error) {
    //         console.error('Error joining room ', error)
    //     }


    // })


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