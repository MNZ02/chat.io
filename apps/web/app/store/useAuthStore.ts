import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    token: null,
    user: null,
    setAuth: (token: string) => set({ token }),
    clearAuth: () => set({ token: null })
}))