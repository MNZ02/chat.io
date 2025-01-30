import { Request, Response } from "express";
import { prisma } from "@repo/db/client";
import { ChatSchema } from "@repo/common/types";


export const getChatByUserId = async (req: Request, res: Response) => {
    try {

        const userId = req.userId

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return
        }

        const chats = await prisma.chat.findMany({
            where: { members: { some: { userId } } },
            include: { messages: true, members: true }
        })

        if (chats.length === 0) {
            res.status(404).json({ message: 'Chats not found' })
            return
        }

        res.status(200).json({ chats })
    } catch (error) {
        console.error('Error getting chat by id', error)
        res.status(500).json({ message: "Internal server error" })
    }
}
export const createChat = async (req: Request, res: Response) => {
    try {
        const parsedData = ChatSchema.safeParse(req.body);
        if (!parsedData.success) {
            console.log(parsedData.error)
            res.status(400).json({ message: 'Zod validation failed' })
            return
        }

        const { isGroup, groupName, members, messages } = parsedData.data

        const chat = await prisma.chat.create({
            data: {
                isGroup,
                groupName: isGroup ? groupName : null,
                members: {
                    create: members.map((userId) => { return { userId } })
                },
                messages: messages ? {
                    create: messages.map((msg) => {
                        return {
                            content: msg.content,
                            senderId: msg.senderId
                        }
                    })
                } : undefined
            },
            include: { members: true, messages: true }
        })

        if (!chat) {
            res.status(400).json({ message: 'Error creating chat' })
            return
        }

        res.status(201).json({ chat })
    } catch (error) {

        console.error('Error creating chat', error)
        res.status(500).json({ message: "Internal server error" })
    }
}


export const getChatById = async (req: Request, res: Response) => {
    try {
        const { chatId } = req.params;
        const userId = req.userId

        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            include: {
                members: true, messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 50
                }
            }
        })


        if (!chat?.members.some((m) => m.id === userId)) {
            res.status(403).json({ message: "Unauthorised to view this chat" })
            return
        }
        res.status(200).json({ chat })
    } catch (error) {
        console.error('Error getting chat by id', error)

        res.status(500).json({ message: "Internal server error" })
    }
}