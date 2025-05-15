import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { JWT_SECRET } from '@repo/backend-common/config';



export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log(`→ authMiddleware: ${req.method} ${req.originalUrl}`);
    try {
        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith('Bearer')) {
            res.status(401).json({ message: 'Unauthorized - Invalid authorization format' });
            return
        }

        const token = authHeader?.split(' ')[1];

        if (!token) {
            res.status(401).json({ message: 'Token not found' })
            return
        }

        if (typeof token !== 'string') {
            return
        }

        const decoded = jwt.verify(token, JWT_SECRET)

        if (!decoded) {
            res.status(400).json({
                message: 'Error decoding token'
            })
            return
        }

        req.userId = (decoded as JwtPayload).userId;


        next();
    } catch (error) {
        console.error('Error decoding token', error)
        res.status(500).json({ message: "Internal server error" })
    }
}