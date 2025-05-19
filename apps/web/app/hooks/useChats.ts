import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

export interface Chat {
    id: string;
    isGroup: boolean;
    groupName: string | null;
    members: { userId: string }[];
    messages: { id: string; content: string; senderId: string; createdAt: string }[];
}

export function useChats() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const { data: session, status } = useSession();
    const token = (session as any)?.user?.accessToken;
    const meId = (session as any)?.user?.id;

    // 1. List all my chats
    const fetchMyChats = useCallback(async () => {
        if (!token) throw new Error("No auth token");
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get<Chat[]>(
                `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/chats`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setChats(data);
            return data;
        } catch (err: any) {
            setError(err);
            return [];
        } finally {
            setLoading(false);
        }
    }, [token]);

    // 2. Load a specific chat by ID
    const fetchChatById = useCallback(
        async (chatId: string) => {
            if (!token) throw new Error("No auth token");
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.get<Chat>(
                    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/chats/${chatId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setActiveChat(data);
                return data;
            } catch (err: any) {
                setError(err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    // 3. Get or create a direct 1:1 chat with another user
    const getDirectChat = useCallback(
        async (otherUserId: string) => {
            if (!token) throw new Error("No auth token");
            setLoading(true);
            setError(null);
            try {
                const { data } = await axios.get<Chat>(
                    `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/chats/direct/${otherUserId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setActiveChat(data);
                return data;
            } catch (err: any) {
                setError(err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [token]
    );

    return {
        // data
        chats,
        activeChat,
        loading,
        error,
        isAuthLoading: status === "loading",
        // actions
        fetchMyChats,
        fetchChatById,
        getDirectChat,
        setActiveChat, // in case you want to override
    };
}
