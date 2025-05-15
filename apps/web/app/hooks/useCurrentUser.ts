// hooks/useCurrentUser.ts
import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export interface CurrentUser {
    id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
    lastSeen?: string
    createdAt: string
}

export function useCurrentUser(autoFetch = true) {
    const [user, setUser] = useState<CurrentUser | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { data: session } = useSession()
    const token = (session as any).user.accessToken
    const fetchMe = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await axios.get<{ user: CurrentUser }>(
                `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/me`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            setUser(response.data.user)
            return response.data.user
        } catch (err: any) {
            setError(err.response?.data?.message || err.message)
            console.error("Error fetching current user", err)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (autoFetch) {
            fetchMe()
        }
    }, [autoFetch, fetchMe])

    return { user, loading, error, fetchMe }
}
