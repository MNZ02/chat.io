import http from 'http'
import { Server } from 'socket.io'
import axios from 'axios'

const PORT = 8080;
const URI = 'http://localhost:3001/api/v1'

const server = http.createServer()


interface Payload {
    id: string
    firstName: string
    lastName: string
    username: string
    password: string
    avatar?: string,
    lastSeen?: string
}


const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})


//Middleware

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token
        const response = await axios.get(`${URI}/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log({ response })
    } catch (error) {
        next(new Error("Authentication Error"))
    }
})



//Connection logic

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`)


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