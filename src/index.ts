import express from 'express'
import dbConnect from './db/dbConnect'
import authRoutes from './modules/auth/routes'
import postRoutes from './modules/post/routes'
import userRoutes from './modules/user/routes'
import cors from 'cors'

const PORT = 8080

dbConnect()

const app = express()

app.use(cors())

app.use(express.json())

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/post', postRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
