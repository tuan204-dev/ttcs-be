import dotenv from 'dotenv'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { ErrorMessages } from '~/constants/common'
import { getResponse } from '~/utils/common'
import { sendVerifyEmail } from '~/utils/sendMail'
import { ILgoutUser, ILoginUser } from './type'
import Recruiter from '~/db/models/recruiterModel'
import RecruiterRefreshToken from '~/db/models/recruiterRefreshTokenModel'
import RecruiterVerifyToken from '~/db/models/recruiterVerifyTokenModel'

dotenv.config()

export const recruiterLogin = async (req: Request<unknown, unknown, ILoginUser>, res: Response) => {
    try {
        const { email, password } = req.body

        const recruiter = await Recruiter.findOne({ email })

        if (!recruiter) {
            res.status(400).json({ message: ErrorMessages.INVALID_CREDENTIALS })
            return
        }

        const isPasswordValid = await recruiter.comparePassword(password)

        if (!isPasswordValid) {
            res.status(400).json({ message: ErrorMessages.INVALID_CREDENTIALS })
            return
        }

        // Generate JWT access token
        const accessToken = recruiter.genJWTAccessToken()
        const refreshToken = uuidv4()

        // Save refresh token
        await RecruiterRefreshToken.create({
            recruiterId: recruiter._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            isRevoked: false
        })

        res.status(200).json(
            getResponse({
                message: 'Login successful',
                data: {
                    recruiter: recruiter.toJSON(),
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

export const recruiterLogout = async (req: Request<unknown, unknown, ILgoutUser>, res: Response) => {
    try {
        const { refreshToken } = req.body

        const refreshTokenDoc = await RecruiterRefreshToken.findOne({ token: refreshToken })

        if (!refreshTokenDoc) {
            res.status(400).json({ message: 'Invalid refresh token' })
            return
        }

        await RecruiterRefreshToken.updateOne({ token: refreshToken }, { isRevoked: true })

        res.status(200).json({ message: 'Logout successful' })
    } catch (e) {
        console.error('Error logging out:', e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const refreshRecruiterToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body

        const refreshTokenDoc = await RecruiterRefreshToken.findOne({ token: refreshToken })

        if (!refreshTokenDoc || refreshTokenDoc.isRevoked || refreshTokenDoc.expiresAt < new Date()) {
            res.status(400).json({ message: ErrorMessages.INVALID_REFRESH_TOKEN })
            return
        }

        const recruiter = await Recruiter.findById(refreshTokenDoc.recruiterId)

        if (!recruiter) {
            res.status(400).json({ message: ErrorMessages.USER_NOT_FOUND })
            return
        }

        const accessToken = recruiter.genJWTAccessToken()

        const newRefreshToken = uuidv4()

        // delete old refresh token
        await RecruiterRefreshToken.deleteOne({ _id: refreshTokenDoc._id })
        // Create new refresh token
        await RecruiterRefreshToken.create({
            recruiterId: recruiter._id,
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

export const getRecruiterInfo = async (req: Request, res: Response) => {
    try {
        const recruiterId = req.user?.id

        const recruiter = await Recruiter.findById(recruiterId)

        if (!recruiter) {
            res.status(404).json(
                getResponse({
                    message: ErrorMessages.USER_NOT_FOUND
                })
            )
            return
        }

        res.status(200).json(
            getResponse({
                message: 'User info retrieved successfully',
                data: recruiter.toJSON()
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

        const recruiter = await Recruiter.findOne({ email })

        if (recruiter) {
            res.status(400).json(
                getResponse({
                    message: ErrorMessages.EMAIL_ALREADY_EXISTS
                })
            )
            return
        }

        const verifyToken = uuidv4()

        const expiredAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        const existingToken = await RecruiterVerifyToken.findOne({ email })

        if (existingToken) {
            existingToken.token = verifyToken
            existingToken.expiredAt = expiredAt
            await existingToken.save()
        } else {
            const verifyTokenDoc = await RecruiterVerifyToken.create({
                email,
                token: verifyToken,
                expiredAt
            })
            await verifyTokenDoc.save()
        }

        const verifyLink = `${process.env.FE_APP_URL}/auth/register/create?token=${verifyToken}`

        await sendVerifyEmail({
            email,
            name: 'Recruiter',
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

export const createRecruiter = async (req: Request, res: Response) => {
    try {
        const { token, password, firstName, lastName, phone, gender, location, avatar } = req.body

        const tokenDoc = await RecruiterVerifyToken.findOne({ token })

        if (!tokenDoc || tokenDoc.expiredAt < new Date()) {
            res.status(400).json(
                getResponse({
                    message: 'Token is invalid!'
                })
            )
            return
        }

        const newRecruiter = new Recruiter({
            email: tokenDoc.email,
            password,
            firstName,
            lastName,
            phone,
            gender,
            location,
            avatar,
        })

        await newRecruiter.save()

        await RecruiterVerifyToken.deleteOne({ _id: tokenDoc._id })

        res.status(201).json({ message: 'Recruiter created successfully' })
    } catch (e) {
        console.log('Error creating recruiter:', e)
        res.status(500).json(
            getResponse({
                message: 'Failed to create recruiter'
            })
        )
    }
}
