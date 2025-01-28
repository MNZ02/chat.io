import express from 'express'
import authRoutes from './routes/authRoutes'

const app: express.Application = express();


app.use(express.json())


app.use('/auth/v1', authRoutes)




export default app;