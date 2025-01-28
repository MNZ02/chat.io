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