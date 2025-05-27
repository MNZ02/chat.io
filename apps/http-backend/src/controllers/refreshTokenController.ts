import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/config";
import { prisma } from "@repo/db/client";

export async function refreshAccessToken(req: Request, res: Response) {

    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token not found" })
        return
    }

    try {

        const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload

        if (!decoded.userId) {
            res.status(403).json({ message: "Invalid refresh token" })
            return

        }

        const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).json({ message: 'Invalid refresh token' });
            return
        }


        const newAccessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
            expiresIn: "15m"
        })
        res.status(200).json({ accessToken: newAccessToken })
    } catch (error) {
        console.error('Error refreshing token', error)
        res.status(500).json({ message: "Internal server error" + error })
    }

}