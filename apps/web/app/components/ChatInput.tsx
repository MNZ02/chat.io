import React from 'react'
import { Paperclip, Send, Smile } from 'lucide-react'
function ChatInput() {
    return (
        <div className='border-t flex items-center p-4 space-x-3'>
            <Smile className='w-6 h-6 text-gray-600' />
            <Paperclip className='w-6 h-6 text-gray-600' />
            <input type="text" placeholder='Type a message' className='flex-1 border rounded-full px-4 py-2 outline-none focus:ring-blue-300' />
            <button className="bg-blue-500 p-2 rounded-full">
                <Send className="w-6 h-6 text-white" />
            </button>
        </div>
    )
}

export default ChatInput
