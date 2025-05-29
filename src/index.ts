import cors from 'cors'
import express from 'express'
import dbConnect from './db/dbConnect'
import recruiterRoutes from './modules/recruiter/routes'
import workerRoutes from './modules/worker/routes'

const PORT = 8080

dbConnect()

const app = express()

app.use(cors())

app.use(express.json())

app.use('/worker', workerRoutes)
app.use('/recruiter', recruiterRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
