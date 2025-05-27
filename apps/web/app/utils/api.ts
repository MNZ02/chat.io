import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001',
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('accessToken') || 'null')
            : null

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
)

export default api
