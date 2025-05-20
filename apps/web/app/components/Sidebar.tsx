import React, { useEffect } from 'react'
import Header from './Header'
import SearchBar from './SearchBar'
import { Archive } from 'lucide-react'
import ChatItem from './ChatItem'
import { useChats } from '../hooks/useChats'

function Sidebar() {

    const { fetchMyChats, chats } = useChats()

    useEffect(() => {
        console.log({ chats })
        fetchMyChats()
    }, [])

    return (
        <div className="w-1/3 bg-gray-100 shadow-2xl m-1">
            <Header />
            <SearchBar />



            {/* Archive */}
            <div className="flex items-center gap-2 p-3 mx-4 mt-2 rounded-md hover:bg-gray-200 cursor-pointer" >
                <Archive className="text-green-400" />
                <p className="text-center text-green-400 ml-2">
                    Archived
                </p>
            </div>


            {/* User */}
            {Array.isArray(chats) && chats.length > 0 ? (
                chats.map((chat) => (
                    <div className="flex-1 overflow-y-auto mt-2" key={chat.id}>
                        <ChatItem key={chat.id} chat={chat} />

                    </div>
                ))
            ) : (
                <div>Nothing to render</div>
            )

            }

        </div >


    )
}

export default Sidebar
