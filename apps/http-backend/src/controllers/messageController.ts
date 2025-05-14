import { Request, Response } from "express";
import { prisma } from "@repo/db/client";
import { messageSchema } from "@repo/common/types";


export const getMessagesByChatId = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const chatId = req.params.chatId as string;
        const limit = Number(req.query.limit) || 50;


        if (!userId) {
            res.status(401).json({ message: "Unauthorized" })
            return;
        }


        //Ensure the user is a member of the chat
        const membership = await prisma.chatUser.findUnique({
            where: {
                userId_chatId: { userId, chatId }
            }
        })

        if (!membership) {
            res.status(403).json({ message: "Forbidden chat" })
            return;
        }


        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                sender: {
                    select: { id: true, firstName: true, lastName: true }
                }
            }
        })

        res.status(200).json({ messages })

    } catch (error) {
        console.error("Error fetching messages for chat", error)
        res.status(500).json({ message: "Internal server error" })
    }
}


export const sendMessage = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: "Unauthorized" })
            return;
        }

        const parsed = messageSchema.safeParse(req.body);

        if (!parsed.success) {
            res.status(400).json({ message: "Validation errors" })
            return;
        }

        const { chatId, content } = parsed.data;


        const member = await prisma.chatUser.findUnique({
            where: {
                userId_chatId: { chatId, userId }
            }
        })

        if (!member) {
            res.status(403).json({ message: "Forbidden chat" })
        }

        const message = await prisma.message.create({
            data: {
                content,
                chat: { connect: { id: chatId } },
                sender: { connect: { id: userId } }
            },
            include: {
                sender: {
                    select: { id: true, firstName: true, lastName: true }
                }
            }
        })

        res.status(201).json({ message })

    } catch (error) {
        console.error("Error sending message", error)
        res.status(500).json({ message: "Intrnal server error" })
    }
}