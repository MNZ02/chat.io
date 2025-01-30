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
        socket.data.token = token
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
    const userId = socket.data.user.id;


    //Fetch user connections
    try {
        const response = await axios.get(`${URI}/chats`, {
            headers: {
                Authorization: `Bearer ${authHeader.query}`
            }
        })
        const chats = response.data.chats;
        if (Array.isArray(chats) && chats?.length) {
            chats.forEach(chat => socket.join(chat.id))
            console.log(`User ${userId} joined ${chats.length} rooms`)
        }

    } catch (error) {
        console.error('Error fetching user connections', error)
    }



    //Join Room

    socket.on('joinRoom', async (roomId) => {
        try {

            const response = await axios.get(`${URI}/chats`, {
                headers: {
                    Authorization: `Bearer ${authHeader}`
                }
            })

            const chats = response.data.chats
            const isMember = chats.some((chat: { id: any; }) => chat.id === roomId)

            if (!isMember) {
                return socket.emit("error", { message: "Unauthorized to join this room" });
            }


            socket.join(roomId)
            socket.data.roomId = roomId
            console.log(`${socket.data.user} joined ${roomId}`);


            //Notify team members
            io.to(roomId).emit('User joined', { userId: socket.data.user.id })

        } catch (error) {
            console.error('Error joining room ', error)
        }


    })


    //Leave room
    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId);
        delete socket.data.roomId;
    });

    //Handle messages
    socket.on('sendMessage', async (message) => {
        console.log('Message received', message)
        try {
            if (!message?.content?.trim()) {
                throw new Error('Message cannot be empty')
            }

            const response = await axios.post(`${URI}/chat`, {
                content: message.content,
                chatId: socket.data.roomId
            }, {
                headers: {
                    Authorization: `Bearer ${socket.data.token}`
                }
            })
            console.log(response.data)
        } catch (error) {
            console.error('Message error: ', error)
            socket.disconnect(true)

        }




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