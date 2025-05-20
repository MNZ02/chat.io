// app/chat/[userId]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useChats } from '../../hooks/useChats'
import ChatWindow from '../../components/ChatWindow'
import { useEffect } from 'react'

export default function ChatPage() {
    const userId = useParams();
    // const { chatId } = useParams()


    const { getDirectChat, activeChat, loading, error, isAuthLoading } = useChats();
    console.log({ activeChat });

    useEffect(() => {
        if (chatId && !isAuthLoading) {
            getDirectChat(chatId as string);
        }
    }, [chatId, isAuthLoading, getDirectChat]);


    if (isAuthLoading || loading) return <p>Loading chat…</p>;
    if (error) return <p className="text-red-500">Error loading chat</p>;
    if (!activeChat) return <p>No chat found</p>;

    return <ChatWindow chat={activeChat} />;
}
