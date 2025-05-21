import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET } from "@repo/backend-common/config";

export async function refreshAccessToken(req: Request, res: Response) {

    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token not found" })
        return
    }

    try {

        const decoded = jwt.verify(refreshToken, JWT_SECRET) as JwtPayload

        if (!decoded.userId) {
            res.status(403).json({ message: "Invalid refresh token" })

        }
        const newAccessiToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, {
            expiresIn: "15m"
        })
        res.status(200).json({ newAccessiToken })
    } catch (error) {
        console.error('Error refreshing token', error)
        res.status(500).json({ message: "Internal server error" + error })
    }

}