import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";


export interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
    username: string;
    createdAt: string;

}

export function useUsers(autoFetch = false) {


    const [users, setUsers] = useState<User[] | null>(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const { data: session } = useSession()
    const token = (session as any).user.accessToken

    const fetchUsers = useCallback(async () => {

        try {
            setLoading(true)
            setError(null)
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/all/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setUsers(response.data.users)
            return response.data;
        }
        catch (error: any) {
            setError(error)
            console.error('Error fetching all users', error)
        }
        finally {
            setLoading(false)
        }


    }, []);
    // Optionally fetch on mount
    useEffect(() => {
        if (autoFetch) {
            fetchUsers();
        }
    }, [autoFetch, fetchUsers]);


    return { fetchUsers, users, loading, error }
}