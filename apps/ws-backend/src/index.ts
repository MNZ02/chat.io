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

    const token = socket.handshake.query.query;
    if (!token) {
        next(new Error("Token not found"))
    }

    try {
        const response = await axios.get(`${URI}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        socket.data.token = token
        socket.data.user = response.data.user
        next();

    } catch (error) {
        console.error('Error authenticating token', error)
        next(new Error('Error authenticating token'))
    }


})

//Connection logic

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


    //Join Room

    socket.on('joinRoom', async (roomId) => {
        try {
            if (typeof roomId !== "string") {
                throw new Error("Invalid roomId. Expected a string.");
            }

            console.log(`Joining room: ${roomId}`);


            //check if a user is a member of the chat
            const chat = await prisma.chat.findFirst({
                where: {
                    id: roomId,
                    members: { some: { userId: socket.data.user.id } }
                }
            })
            if (!chat) {
                return socket.emit("error", { message: "Unauthorized to join this room" });
            }

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
            const chatMembership = await prisma.chatUser.findFirst({
                where: {
                    chatId: socket.data.roomId,
                    userId: socket.data.user.id
                }
            })

            if (!chatMembership) {
                throw new Error('No longer in the chat')
            }


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