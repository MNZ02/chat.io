import { create } from 'zustand'


interface AuthState {
    token: string | null;
    user: { id: string; username: string } | null;
    setAuth: (token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: null,
    user: null,
    setAuth: (token: string) => set({ token }),
    clearAuth: () => set({ token: null })
}))