"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

export default function Homepage() {
    const router = useRouter();





    return (
        <div className="flex">

            <Sidebar />
            <ChatWindow />

        </div>
    )
}