import { Socket } from "socket.io";
import { prisma } from "@repo/db/client";


export const sendMessage = async (socket: Socket, message: any) => {
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




}