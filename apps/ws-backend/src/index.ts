import http from 'http'
import { Server } from 'socket.io'
import axios from 'axios';
import { prisma } from '@repo/db/client'

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
        socket.data.user = response.data.user
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
        console.log({ chats })
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
            if (typeof roomId !== "string") {
                throw new Error("Invalid roomId. Expected a string.");
            }

            console.log(`Joining room: ${roomId}`);


            socket.join(roomId)
            socket.data.roomId = roomId
            console.log(`User ${socket.data.user.id} joined room ${roomId}`);


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
        try {
            const data = typeof message === "string" ? JSON.parse(message) : message;
            console.log("Received message:", data);
            if (!data?.content?.trim()) {
                throw new Error('Message cannot be empty')
            }

            if (!socket.data.roomId) {
                throw new Error('Not in a chat room')
            }

            //verify user is still in the chat
            // const chatMembership = await prisma.chatUser.findFirst({
            //     where: {
            //         chatId: socket.data.roomId,
            //         userId: socket.data.user.id
            //     }
            // })

            // if (!chatMembership) {
            //     throw new Error('No longer in the chat')
            // }


            const response = await prisma.message.create({
                data: {
                    content: data.content,
                    chatId: socket.data.roomId,
                    senderId: socket.data.user.id
                },
                include: { sender: true }
            })

            // Broadcast to room (excluding sender if needed)
            socket.to(socket.data.roomId).emit('receiveMessage', response);


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

function callback(arg0: { status: string; message: { status: string; id: any; content: any; chatId: any; createdAt: any; sender: { id: any; name: any; avatar: any; }; }; }) {
    throw new Error('Function not implemented.');
}
