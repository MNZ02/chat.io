import React from 'react'
import { useSession } from 'next-auth/react'

interface ChatMember {
    userId: string;
    users: {
        firstName: string;
        lastName: string;
        avatar: string;
    };
}

interface Chat {
    id: string;
    isGroup: boolean;
    groupName?: string;
    members: ChatMember[];
    messages: {
        content: string;
        createdAt: string;
        senderId: string;
    }[];
}

interface ChatProps {
    chat: Chat;
}

function ChatItem({ chat }: ChatProps) {
    const { data: session } = useSession()

    const meId = (session as any)?.user.id
    const other = chat.members.find(m => m.userId !== meId)!
    const name = chat.isGroup ? chat.groupName! : other.users.firstName
    const msgs = chat.messages
    const last = msgs[msgs.length - 1]
    const lastMessage = last?.content ?? ''
    const time = last
        ? new Date(last.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : ''
    // const unread = msgs.reduce((sum, m) => sum + (m.readBy?.includes(meId) ? 0 : 1), 0)


    return (
        <div className="flex items-center p-3 mx-4 my-1 rounded-md hover:bg-gray-200 cursor-pointer">

            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
                <h1 className="text-gray-600 font-semibold p-4 ">{other.users.avatar || other.users.firstName.split('')[0]}</h1>
            </div>

            <div className="flex-1 ml-3">
                <div className="flex justify-between">

                    <h2 className="font-semibold text-gray-800">{other.users.firstName} {other.users.lastName}</h2>
                    <span className="text-xs text-gray-500">{time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
            </div>
        </div>
    )
}

export default ChatItem
