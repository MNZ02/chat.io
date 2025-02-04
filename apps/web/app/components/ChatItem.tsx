import React from 'react'


interface ChatProps {
    chat: {
        id: number;
        name: string;
        lastMessage: string;
        time: string;
        unread: number;
    };
}

function ChatItem({ chat }: ChatProps) {
    return (
        <div className="flex items-center p-3 mx-4 my-1 rounded-md hover:bg-gray-200 cursor-pointer">

            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
                <h1 className="text-gray-600 font-semibold p-4 ">{chat.name.split('')[0]}</h1>
            </div>

            <div className="flex-1 ml-3">
                <div className="flex justify-between">

                    <h2 className="font-semibold text-gray-800">{chat.name}</h2>
                    <span className="text-xs text-gray-500">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>
        </div>
    )
}

export default ChatItem
