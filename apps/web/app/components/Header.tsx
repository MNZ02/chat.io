"use client";
import React from 'react'
import { MessageCircle, Moon } from 'lucide-react'

function Header() {
    return (
        <div className='h-20 flex items-center p-2 justify-between border-b'>
            {/* Header */}

            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full mx-3 cursor-pointer">
                <h1 className="text-gray-700 font-semibold p-4 ">AD</h1>
            </div>

            <div className="flex gap-3">
                {/* Message Icon */}
                <button className="relative group p-2 rounded-full transition duration-300">
                    <span className="absolute inset-0 bg-gray-300 rounded-full scale-0 group-hover:scale-100 cursor-pointer"></span>
                    <MessageCircle className="relative w-6 h-6 text-gray-600 cursor-pointer" />
                </button>

                {/* Moon Icon */}
                <button className="relative group p-2 rounded-full transition duration-300">
                    <span className="absolute inset-0 bg-gray-300 rounded-full scale-0 group-hover:scale-100"></span>
                    <Moon className="relative w-6 h-6 text-gray-600 cursor-pointer" />
                </button>
            </div>
        </div>
    )
}

export default Header

