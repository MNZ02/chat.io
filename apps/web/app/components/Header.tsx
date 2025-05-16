import React, { useState, useEffect } from 'react'
import { MessageCirclePlusIcon, Moon } from 'lucide-react'
import { User, useUsers } from '../hooks/useUsers'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCurrentUser } from '../hooks/useCurrentUser'


export default function Header() {
    const [isOpen, setIsOpen] = useState(false)


    const router = useRouter()

    const { fetchUsers, users, loading, error } = useUsers()
    const { user: me, loading: meLoading, error: meError } = useCurrentUser()
    useEffect(() => {
        if (isOpen) {
            fetchUsers()
        }
    }, [isOpen, fetchUsers])


    return (


        <div className='h-20 flex items-center p-2 justify-between border-b relative'>
            {/* Header */}

            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full mx-3 cursor-pointer">
                <h1 className="text-gray-700 font-semibold p-4 ">{me?.firstName.charAt(0)}{me?.lastName.charAt(0)}</h1>
            </div>

            <div className="flex gap-3">
                {/* Message Icon with dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(open => !open)}
                        className="relative group p-2 rounded-full transition duration-300"
                    >
                        <span className="absolute inset-0 bg-gray-300 rounded-full scale-0 group-hover:scale-100 cursor-pointer"></span>
                        <MessageCirclePlusIcon className="relative w-6 h-6 text-gray-600 cursor-pointer" />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border z-10">
                            <div className="p-3 border-b">
                                <h3 className="font-medium">Select a user</h3>
                            </div>
                            <ul className="max-h-64 overflow-y-auto">
                                {Array.isArray(users) && users.length > 0 ? (
                                    users.map(user => (
                                        <li
                                            key={user.id}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                                            onClick={() => {
                                                console.log('Selected user:', user)
                                                setIsOpen(false)
                                                router.push(`/chat/${user.id}`)
                                            }}
                                        >
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                                                {user.firstName.charAt(0)}
                                            </div>
                                            <span>{user.firstName} {user.lastName}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-3 text-center text-gray-500">No users found</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Moon Icon */}
                <button className="relative group p-2 rounded-full transition duration-300">
                    <span className="absolute inset-0 bg-gray-300 rounded-full scale-0 group-hover:scale-100"></span>
                    <Moon className="relative w-6 h-6 text-gray-600 cursor-pointer"
                    />
                </button>
            </div>
        </div>
    )
}
