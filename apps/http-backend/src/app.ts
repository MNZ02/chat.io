import express from 'express'
import authRoutes from './routes/authRoutes'
import chatRoutes from './routes/chatRoutes'
import userRoutes from './routes/userRoutes'
import cors from 'cors'

const app: express.Application = express();


app.use(express.json())
app.use(cors({
    origin: true
}))


app.use('/auth/v1', authRoutes)
app.use('/api/v1', chatRoutes)

app.use('/api/v1', userRoutes)




export default app;