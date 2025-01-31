import { Socket } from "socket.io";
import { prisma } from "@repo/db/client";


export const joinRoom = async (socket: Socket, roomId: string) => {
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
        socket.to(roomId).emit('User joined', { userId: socket.data.user.id })

    } catch (error) {
        console.error('Error joining room ', error)
    }
}


export const leaveRoom = async (socket: Socket, roomId: string) => {
    socket.leave(roomId);
    delete socket.data.roomId;
}



