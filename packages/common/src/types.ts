import { z } from 'zod'


export const RegisterSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    username: z.string().min(3).max(20),
    password: z.string().min(8)
})


export const LoginSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(8)
})

export const ChatSchema = z.object({
    isGroup: z.boolean(),
    groupName: z.string().nullable().optional(),
    members: z.array(z.string()),
    messages: z.array(
        z.object({
            content: z.string().min(2),
            senderId: z.string(),
            createdAt: z.date().optional()
        })
    )
})

export const messageSchema = z.object({
    chatId: z.string().uuid(),
    content: z.string().min(1).max(2000)
})