import { Request, Response } from 'express'
import { prisma } from '@repo/db/client'
import { RegisterSchema, LoginSchema } from '@repo/common/types'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export const register = async (req: Request, res: Response) => {
    try {
        const parsedData = RegisterSchema.safeParse(req.body)

        if (!parsedData.success) {
            res.status(400).json({ message: 'Zod validation failed' })
            return
        }

        const existingUser = await prisma.user.findUnique({
            where: { username: parsedData.data.username }
        })

        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' })
            return
        }

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const user = await prisma.user.create({
            data: {
                firstName: parsedData.data.firstName,
                lastName: parsedData.data.lastName,
                username: parsedData.data.username,
                password: hashedPassword
            }
        })


        if (!user) {
            res.status(400).json({ message: 'Error creating user' })
            return
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' })


    } catch (error) {
        console.error('Error regisering user', error)
        res.status(500).json({ message: "Internal server error" })
    }
}