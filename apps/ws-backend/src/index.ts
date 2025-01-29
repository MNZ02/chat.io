import http from 'http'
import { Server } from 'socket.io'

const PORT = 8080;


const server = http.createServer()


const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})


//Connection logic

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`)


    //Handle messages
    socket.on('sendMessage', (message) => {
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