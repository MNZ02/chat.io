import { io, URI } from "../index";
import axios from "axios";



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
        socket.data.user = response.data
        next();
    } catch (error) {
        next(new Error("Authentication Error"))
    }
})