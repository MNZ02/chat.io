import { Socket } from "socket.io";
import { URI } from "../config";
import axios from "axios";



//Middleware

export const authMiddleware = async (socket: Socket, next: any) => {

    const token = socket.handshake.query.token;
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

}