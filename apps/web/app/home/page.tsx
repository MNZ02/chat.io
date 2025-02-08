"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";

export default function Homepage() {
    const router = useRouter();

    const { data: session, status } = useSession()


    useEffect(() => {
        console.log(status)
    }, [status])

    if (status === "loading") return <p>Loading...</p>;
    if (!session) return <p>Not authenticated</p>;

    return (
        <div className="flex">

            <Sidebar />
            <ChatWindow />

        </div>
    )
}