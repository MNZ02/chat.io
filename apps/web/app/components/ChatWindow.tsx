import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';
import { useChats } from '../hooks/useChats';

interface MessageProps {
    id: string;
    text: string;
    fromMe: boolean;
}

function ChatWindow({ userId }: { userId: string }) {
    const { fetchChatsByUserId, chats, loading, error, isLoadingSession } = useChats();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (userId && !isLoadingSession) {
            fetchChatsByUserId(userId);
        }
    }, [userId, fetchChatsByUserId, isLoadingSession]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chats]);

    if (loading) {
        return <div className="p-4 text-center">Loading conversation…</div>;
    }
    if (error) {
        return <div className="p-4 text-center text-red-500">Error loading chat.</div>;
    }

    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex-1 overflow-y-auto p-4">
                {chats.length === 0 ? (
                    <p className="text-center text-gray-500">No messages yet.</p>
                ) : (
                    chats.map((message: MessageProps) => (
                        <div
                            key={message.id}
                            className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'} mb-4`}
                        >
                            <div
                                className={`max-w-xs p-3 rounded-xl ${message.fromMe
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                    }`}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Fixed input at bottom */}
            <div className="border-t p-4 bg-white">
                {/* <ChatInput
                    onSend={async (text) => {
                        // post new message
                        const newMsg = await fetchChatsByUserId(userId, text);
                        // assuming fetchChatsByUserId appends the new message into `chats`
                        // otherwise you’d do setChats(prev => [...prev, newMsg])
                    }}
                /> */}
            </div>
        </div>
    );
}

export default ChatWindow;
