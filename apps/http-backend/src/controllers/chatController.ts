import { Request, Response } from "express";
import { prisma } from "@repo/db/client";
import { ChatSchema } from "@repo/common/types";


export const listChats = async (req: Request, res: Response) => {
    try {
        const me = req.userId;

        if (!me) {
            res.sendStatus(401)
            return;
        }

        const chats = await prisma.chat.findMany({
            where: { members: { some: { userId: me } } },
            select: {
                id: true,
                isGroup: true,
                groupName: true,
                members: {
                    select: {
                        userId: true,
                        users: { select: { firstName: true, lastName: true, avatar: true } }
                    }
                },
                messages: { take: 1, orderBy: { createdAt: 'desc' } }
            }
        })

        if (!chats) {
            res.status(404).json({ message: "Chats not found" })
            return;
        }

        res.status(200).json({ chats })
    } catch (error) {
        console.error("Error listing chats", error)
        res.status(500).json({ message: "Internal server error" })
    }

}


export const getChats = async (req: Request, res: Response) => {
    try {
        const me = req.userId;
        const { chatId } = req.params;

        if (!me) {
            res.sendStatus(401)
            return
        }

        const chat = await prisma.chat.findMany({
            where: { id: chatId },
            include: {
                members: true,
                messages: { orderBy: { createdAt: 'asc' }, take: 50 }
            }
        })
        if (!chat) {
            res.sendStatus(404);
            return
        }
        res.json(chat);
    } catch (error) {
        console.error("Error getting chats", error)
        res.status(500).json({ message: "Internal server error" })

    }
}

export const getOrCreateDirectChat = async (req: Request, res: Response) => {
    const me = req.userId;
    const other = req.params.otherUserId;
    if (!me) {
        res.sendStatus(401);
        return

    }

    let chat = await prisma.chat.findFirst({
        where: {
            isGroup: false,
            members: { every: { userId: { in: [me, other as string] } } },
            // AND: { members: { count: 2 } }
        },
        include: { members: true, messages: true }
    });
    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                isGroup: false,
                members: { create: [{ userId: me, role: 'member' }, { userId: other as string, role: 'member' }] }
            },
            include: { members: true, messages: true }
        });
    }
    res.json(chat);
};
export const createChat = async (req: Request, res: Response) => {
    const me = req.userId;
    if (!me) {
        res.sendStatus(401);
        return

    }

    const parsed = ChatSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.format() });
        return
    }
    const { isGroup, groupName, members, messages } = parsed.data;

    const chat = await prisma.chat.create({
        data: {
            isGroup,
            groupName: isGroup ? groupName : null,
            members: {
                create: members.map(uid => ({ userId: uid, role: uid === me ? 'admin' : 'member' }))
            },
            messages: messages?.length
                ? { create: messages.map(({ content, senderId }) => ({ content, senderId })) }
                : undefined
        },
        include: { members: true, messages: true }
    });
    res.status(201).json(chat);
};


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