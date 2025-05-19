// app/chat/[userId]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useChats } from '../../hooks/useChats'
import ChatWindow from '../../components/ChatWindow'
import { useEffect } from 'react'

export default function ChatPage() {
    const { chatId } = useParams()


    const { fetchChatById, activeChat, loading, error, isAuthLoading } = useChats();

    useEffect(() => {
        if (chatId && !isAuthLoading) {
            fetchChatById(chatId as string);
        }
    }, [chatId, isAuthLoading, fetchChatById]);


    if (isAuthLoading || loading) return <p>Loading chat…</p>;
    if (error) return <p className="text-red-500">Error loading chat</p>;
    if (!activeChat) return <p>No chat found</p>;

    return <ChatWindow chat={activeChat} />;
}
