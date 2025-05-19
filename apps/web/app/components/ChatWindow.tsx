import React, { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import { Chat } from '../hooks/useChats';
import { useSession } from 'next-auth/react';


interface ChatWindowProps {
    chat: Chat;
}

export default function ChatWindow({ chat }: ChatWindowProps) {
    const { data: session } = useSession()
    const meId = (session as any)?.user?.id

    const [messages, setMessages] = useState(chat?.messages || []);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-500">No messages yet.</p>
                ) : (
                    messages
                        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        .map((m) => {
                            const fromMe = m.senderId === meId;
                            return (
                                <div
                                    key={m.id}
                                    className={`flex ${fromMe ? 'justify-end' : 'justify-start'} mb-4`}
                                >
                                    <div
                                        className={`max-w-xs p-3 rounded-xl ${fromMe
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                                            }`}
                                    >
                                        {m.content}
                                    </div>
                                </div>
                            );
                        })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Fixed input at bottom */}
            <div className="border-t p-4 bg-white">
                {/* <ChatInput onSend={onSend} /> */}
            </div>
        </div>
    );
}