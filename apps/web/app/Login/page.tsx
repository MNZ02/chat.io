"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { HTTP_URL } from "../../config/config";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        try {
            // Replace with your actual login endpoint URL
            const res = await axios.post(`${HTTP_URL}/auth/v1/login`, { username, password });
            console.log({ res })
            const { token } = res.data;
            localStorage.setItem("token", token);
            router.push("/");
        } catch (err: any) {
            console.error("Login error:", err);
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 dark:from-gray-900 dark:to-gray-700">
            <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-2xl w-full max-w-md">
                {/* Logo / App Title */}
                <div className="flex flex-col items-center mb-8">
                    {/* Replace this with your actual logo */}
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">.io</span>
                    </div>
                    <h2 className="mt-4 text-3xl font-bold text-gray-800 dark:text-white">
                        Chat.io
                    </h2>
                </div>

                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white py-3 rounded-lg transition duration-300 font-semibold"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
