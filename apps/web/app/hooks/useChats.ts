import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";


export function useChats() {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { data: session, status } = useSession();

    const token = (session as any)?.user?.accessToken;

    const fetchChatsByUserId = useCallback(async (userId: string) => {
        if (!token) {
            throw new Error("Cannot fetch chats before auth completes")
        }
        setLoading(true)
        setError(null)
        try {

            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/chats?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log(response.data.chats)
            setChats(response.data.chats)
            return response.data.chats;
        } catch (error: any) {
            console.error("Error fetching chats by userId", error)
            setError(error)
        }
        finally {
            setLoading(false)
        }
    }, [token])
    return { fetchChatsByUserId, chats, loading, error, isLoadingSession: status === 'loading' }
}