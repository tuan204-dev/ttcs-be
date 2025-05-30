import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { ErrorMessages } from '~/constants/common'
import Worker from '~/db/models/workerModel'
import WorkerRefreshToken from '~/db/models/workerRefreshTokenModel'
import { getResponse } from '~/utils/common'
import { sendVerifyEmail } from '~/utils/sendMail'
import { ILogoutUser, ILoginUser } from './type'
import WorkerVerifyToken from '~/db/models/workerVerifyTokenModel'

dotenv.config()

export const workerLogin = async (req: Request<unknown, unknown, ILoginUser>, res: Response) => {
    try {
        const { email, password } = req.body

        const worker = await Worker.findOne({ email })

        if (!worker) {
            res.status(400).json({ message: ErrorMessages.INVALID_CREDENTIALS })
            return
        }

        const isPasswordValid = await worker.comparePassword(password)

        if (!isPasswordValid) {
            res.status(400).json({ message: ErrorMessages.INVALID_CREDENTIALS })
            return
        }

        // Generate JWT access token
        const accessToken = worker.genJWTAccessToken()
        const refreshToken = uuidv4()

        // Save refresh token
        await WorkerRefreshToken.create({
            workerId: worker._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            isRevoked: false
        })

        res.status(200).json(
            getResponse({
                message: 'Login successful',
                data: {
                    recruiter: worker.toJSON(),
                    accessToken,
                    refreshToken
                }
            })
        )
    } catch (e) {
        console.error('Error logging in:', e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const workerLogout = async (req: Request<unknown, unknown, ILogoutUser>, res: Response) => {
    try {
        const { refreshToken } = req.body

        const refreshTokenDoc = await WorkerRefreshToken.findOne({ token: refreshToken })

        if (!refreshTokenDoc) {
            res.status(400).json({ message: 'Invalid refresh token' })
            return
        }

        await WorkerRefreshToken.updateOne({ token: refreshToken }, { isRevoked: true })

        res.status(200).json({ message: 'Logout successful' })
    } catch (e) {
        console.error('Error logging out:', e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const refreshWorkerToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body

        const refreshTokenDoc = await WorkerRefreshToken.findOne({ token: refreshToken })

        if (!refreshTokenDoc || refreshTokenDoc.isRevoked || refreshTokenDoc.expiresAt < new Date()) {
            res.status(400).json({ message: ErrorMessages.INVALID_REFRESH_TOKEN })
            return
        }

        const worker = await Worker.findById(refreshTokenDoc.workerId)

        if (!worker) {
            res.status(400).json({ message: 'User not found' })
            return
        }

        const accessToken = worker.genJWTAccessToken()

        const newRefreshToken = uuidv4()

        // delete old refresh token
        await WorkerRefreshToken.deleteOne({ _id: refreshTokenDoc._id })
        // Create new refresh token
        await WorkerRefreshToken.create({
            workerId: worker._id,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            isRevoked: false
        })

        res.status(200).json(
            getResponse({
                message: 'Token refreshed successfully',
                data: {
                    accessToken,
                    refreshToken: newRefreshToken
                }
            })
        )
    } catch (e) {
        console.error('Error refreshing token:', e)
        res.status(500).json(
            getResponse({
                message: 'Refresh token failed'
            })
        )
    }
}

export const getWorkerInfo = async (req: Request, res: Response) => {
    try {
        const workerId = req.user?.id

        const worker = await Worker.findById(workerId)

        if (!worker) {
            res.status(404).json(
                getResponse({
                    message: 'User not found'
                })
            )
            return
        }

        res.status(200).json(
            getResponse({
                message: 'User info retrieved successfully',
                data: worker.toJSON()
            })
        )
    } catch (e) {
        console.error('Error getting user info:', e)
        res.status(500).json(
            getResponse({
                message: 'Failed to get user info'
            })
        )
    }
}

export const sendVerifyEmailHandler = async (req: Request, res: Response) => {
    try {
        const { email } = req.body

        const worker = await Worker.findOne({ email })

        if (worker) {
            res.status(400).json(
                getResponse({
                    message: ErrorMessages.EMAIL_ALREADY_EXISTS
                })
            )
            return
        }

        const verifyToken = uuidv4()

        const expiredAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        const existingToken = await WorkerVerifyToken.findOne({ email })

        if (existingToken) {
            existingToken.token = verifyToken
            existingToken.expiredAt = expiredAt
            await existingToken.save()
        } else {
            const verifyTokenDoc = await WorkerVerifyToken.create({
                email,
                token: verifyToken,
                expiredAt
            })
            await verifyTokenDoc.save()
        }

        const verifyLink = `${process.env.FE_APP_URL}/auth/register/create?token=${verifyToken}`

        await sendVerifyEmail({
            email,
            name: 'User',
            verifyLink
        })

        res.status(200).json(
            getResponse({
                message: 'Verification email sent successfully'
            })
        )
    } catch (e) {
        console.error('Error sending verification email:', e)
        res.status(500).json(
            getResponse({
                message: 'Failed to send verification email'
            })
        )
    }
}

export const createWorker = async (req: Request, res: Response) => {
    try {
        const { token, password, firstName, lastName, phone, gender, location, avatar, education, skills } = req.body

        const tokenDoc = await WorkerVerifyToken.findOne({ token })

        if (!tokenDoc || tokenDoc.expiredAt < new Date()) {
            res.status(400).json(
                getResponse({
                    message: 'Token is invalid!'
                })
            )
            return
        }

        const newWorker = new Worker({
            email: tokenDoc.email,
            password,
            firstName,
            lastName,
            phone,
            gender,
            location,
            avatar,
            education,
            skills
        })

        await newWorker.save()

        await WorkerVerifyToken.deleteOne({ _id: tokenDoc._id })

        res.status(201).json({ message: 'User created successfully' })
    } catch (e) {
        console.log('Error creating user:', e)
        res.status(500).json(
            getResponse({
                message: 'Failed to create user'
            })
        )
    }
}
