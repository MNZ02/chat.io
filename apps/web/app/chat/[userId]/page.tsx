// app/chat/[userId]/page.tsx
'use client'  // if ChatWindow is a client component

import { useParams } from 'next/navigation'
import ChatWindow from '../../components/ChatWindow'
export default function ChatPage() {
    const params = useParams()
    const userId = params?.userId

    if (!userId) {
        return <p>User ID not found</p>
    }

    return <ChatWindow otherUserId={userId} />
}
