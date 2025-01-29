import { Request, Response } from "express";
import { prisma } from "@repo/db/client";


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


    } catch (error) {
        console.error('Error creating chat', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}