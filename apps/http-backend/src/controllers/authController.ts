import { Request, Response } from 'express'
import { prisma } from '@repo/db/client'
import { RegisterSchema, LoginSchema } from '@repo/common/types'
import { JWT_SECRET } from '@repo/backend-common/config'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const generateRefreshToken = (userId: string) => {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
    return token
}

const generateAccessToken = (userId: string) => {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' })
    return token
}


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



        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        })

        res.status(201).json({ accessToken, refreshToken })


    } catch (error) {
        console.error('Error regisering user', error)
        res.status(500).json({ message: "Internal server error" })
    }
}


export const login = async (req: Request, res: Response) => {
    try {
        const parsedData = LoginSchema.safeParse(req.body)

        if (!parsedData.success) {
            res.status(400).json({ message: "Zod validation failed" })
            return;
        }


        const user = await prisma.user.findUnique({
            where: { username: parsedData.data?.username }
        })

        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        const comparedPassword = await bcrypt.compare(parsedData.data.password, user.password);

        if (!comparedPassword) {
            res.status(400).json({ message: 'Invalid password' })
            return
        }


        const accessToken = generateAccessToken(user.id)
        const refreshToken = generateRefreshToken(user.id)

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
        })


        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })


        res.status(200).json({ accessToken })
    } catch (error) {
        console.error('Error logging in', error)
        res.status(500).json({ message: "Internal server error" })
    }
}