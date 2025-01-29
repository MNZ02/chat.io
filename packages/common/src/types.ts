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
    groupName: z.string().optional(),
    members: z.array(z.string().uuid()).min(1),
    messages: z.array(
        z.object({
            content: z.string().min(1),
            senderId: z.string(),
            chatId: z.string().uuid(),
            createdAt: z.date().optional(),
        })
    ).optional()
})