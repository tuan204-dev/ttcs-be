import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

async function dbConnect() {
    if (!process.env.DB_URL) {
        throw new Error('DB_URL is not defined in the environment variables')
    }

    mongoose
        .connect(process.env.DB_URL)
        .then(() => {
            console.log('Successfully connected to MongoDB Atlas!')
        })
        .catch((error) => {
            console.log('Unable to connect to MongoDB Atlas!')
            console.error(error)
        })
}

export default dbConnect
