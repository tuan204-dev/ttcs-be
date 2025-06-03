import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { IUserPayload } from '~/types/ICommon'
dotenv.config()

export const workerAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtSecret = process.env.WORKER_JWT_ACCESS_TOKEN_SECRET

        if (!jwtSecret) {
            res.status(500).json({ message: 'JWT secret is not configured' })
            return
        }

        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authorization header is missing or invalid' })
            return
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, jwtSecret) as IUserPayload

        req.user = decoded

        next()
    } catch (error) {
        console.error('Authentication error:', error)
        res.status(401).json({ message: 'Unauthorized access' })
        return
    }
}

export const recruiterAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jwtSecret = process.env.RECRUITER_JWT_ACCESS_TOKEN_SECRET

        if (!jwtSecret) {
            res.status(500).json({ message: 'JWT secret is not configured' })
            return
        }

        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authorization header is missing or invalid' })
            return
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, jwtSecret) as IUserPayload

        req.user = decoded

        next()
    } catch (error) {
        console.error('Authentication error:', error)
        res.status(401).json({ message: 'Unauthorized access' })
        return
    }
}

export const userAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const workerSecret = process.env.WORKER_JWT_ACCESS_TOKEN_SECRET
        const recruiterSecret = process.env.RECRUITER_JWT_ACCESS_TOKEN_SECRET

        if (!workerSecret || !recruiterSecret) {
            res.status(500).json({ message: 'JWT secret is not configured' })
            return
        }

        const authHeader = req.headers.authorization
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Authorization header is missing or invalid' })
            return
        }

        const token = authHeader.split(' ')[1]

        let decoded: IUserPayload | null = null

        try {
            decoded = jwt.verify(token, workerSecret) as IUserPayload
        } catch {
            try {
                decoded = jwt.verify(token, recruiterSecret) as IUserPayload
            } catch {
                res.status(401).json({ message: 'Unauthorized access' })
                return
            }
        }

        req.user = decoded
        next()
    } catch (error) {
        console.error('Authentication error:', error)
        res.status(401).json({ message: 'Unauthorized access' })
        return
    }
}

