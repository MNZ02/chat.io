import React, { useEffect, useRef } from 'react';
import ChatInput from './ChatInput';

interface MessageProps {
    id: string;
    text: string;
    fromMe: boolean;
}

const messages = [
    { id: 1, text: "Hello, how are you?", fromMe: false },
    { id: 2, text: "I'm good, thanks! How about you?", fromMe: true },
    { id: 3, text: "Doing well. Did you check the new project update?", fromMe: false },
    { id: 4, text: "Yes, looks great!", fromMe: true },
];

function ChatWindow({ userId }: { userId: string }) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex flex-col h-screen w-full">
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col-reverse min-h-full"> {/* Reverse column */}
                    {/* Spacer to push messages to bottom */}
                    <div className="flex-1" />

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.fromMe ? "justify-end" : "justify-start"} mb-4`}
                        >
                            <div className={`max-w-xs p-3 rounded-xl ${message.fromMe
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-200 text-gray-800 rounded-bl-none"
                                }`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Fixed input at bottom */}
            <div className="border-t p-4 bg-white">
                <ChatInput />
            </div>
        </div>
    );
}

export default ChatWindow;