import cors from 'cors'
import express from 'express'
import dbConnect from './db/dbConnect'
import recruiterRoutes from './modules/recruiter/routes'
import workerRoutes from './modules/worker/routes'
import jobRoutes from './modules/job/routes'
import bookmarkRoutes from './modules/bookmark/routes'
import recruitingRoutes from './modules/recruiting/routes'

const PORT = 8000

dbConnect()

const app = express()

app.use(cors())

app.use(express.json())

app.use('/worker', workerRoutes)
app.use('/recruiter', recruiterRoutes)
app.use('/job', jobRoutes)
app.use('/bookmark', bookmarkRoutes)
app.use('/recruiting', recruitingRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
