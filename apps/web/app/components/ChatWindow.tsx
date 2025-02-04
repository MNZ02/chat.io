import React from 'react'

interface MessageProps {
    id: string;
    text: string;
    fromMe: string;
}


const messages = [
    { id: 1, text: "Hello, how are you?", fromMe: false },
    { id: 2, text: "I'm good, thanks! How about you?", fromMe: true },
    { id: 3, text: "Doing well. Did you check the new project update?", fromMe: false },
    { id: 4, text: "Yes, looks great!", fromMe: true },
    // Add more messages as needed
];
function ChatWindow() {
    return (
        // <div className="flex flex-col justify-center items-center bg-gray-100 h-screen w-2/3">
        //     <h1 className="text-3xl">Whatsapp Web</h1>
        //     <h2 className="text-lg p-4">Send and receive messages without keeping your phone online.
        //         Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</h2>
        // </div>

        <div className='flex-1 p-4 overflow-y-auto space-y-4 bg-gray-100'>
            {messages.map((message) => (
                <div key={message.id} className={`flex ${message.fromMe ? "justify-start" : "justify-end"} `}>


                </div>
            ))}

        </div>
    )
}

export default ChatWindow
