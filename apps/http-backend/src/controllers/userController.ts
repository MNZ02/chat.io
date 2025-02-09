import { prisma } from "@repo/db/client";
import { Request, Response } from "express";

export const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;


        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' })
            return
        }
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            res.status(404).json({ message: "My user not found" })
            return
        }
        res.status(200).json({ user })
    } catch (error) {
        console.error('Error getting my user', error)
        res.status(500).json({ message: "Internal server error" })
    }
}