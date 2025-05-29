import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import RefreshToken from '~/db/models/refreshTokenModel'
import User from '~/db/models/userModel'
import { getResponse, isEmail } from '~/utils/common'
import { sendVerifyEmail } from '~/utils/sendMail'
import { ILgoutUser, ILoginUser } from './type'
import VerifyToken from '~/db/models/verifyTokenModel'
import dotenv from 'dotenv'
import { ErrorMessages } from '~/constants/common'

dotenv.config()

export const login = async (req: Request<unknown, unknown, ILoginUser>, res: Response) => {
    try {
        const { loginName, password } = req.body

        let user

        if (isEmail(loginName)) {
            user = await User.findOne({ email: loginName })
        } else {
            user = await User.findOne({ loginName })
        }

        if (!user) {
            res.status(400).json({ message: 'User name or password is invalid' })
            return
        }

        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            res.status(400).json({ message: 'User name or password is invalid' })
            return
        }

        // Generate JWT access token
        const accessToken = user.genJWTAccessToken()
        const refreshToken = uuidv4()

        // Save refresh token
        await RefreshToken.create({
            userId: user._id,
            token: refreshToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            isRevoked: false
        })

        res.status(200).json(
            getResponse({
                message: 'Login successful',
                data: {
                    user: user.toJSON(),
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

export const logout = async (req: Request<unknown, unknown, ILgoutUser>, res: Response) => {
    try {
        const { refreshToken } = req.body

        const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken })

        if (!refreshTokenDoc) {
            res.status(400).json({ message: 'Invalid refresh token' })
            return
        }

        RefreshToken.updateOne({ token: refreshToken }, { isRevoked: true }).exec()

        res.status(200).json({ message: 'Logout successful' })
    } catch (e) {
        console.error('Error logging out:', e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body

        const refreshTokenDoc = await RefreshToken.findOne({ token: refreshToken })

        if (!refreshTokenDoc || refreshTokenDoc.isRevoked || refreshTokenDoc.expiresAt < new Date()) {
            res.status(400).json({ message: 'Invalid or revoked refresh token' })
            return
        }

        const user = await User.findById(refreshTokenDoc.userId)

        if (!user) {
            res.status(400).json({ message: 'User not found' })
            return
        }

        const accessToken = user.genJWTAccessToken()

        const newRefreshToken = uuidv4()

        // delete old refresh token
        await RefreshToken.deleteOne({ _id: refreshTokenDoc._id })
        // Create new refresh token
        await RefreshToken.create({
            userId: user._id,
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

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id

        const user = await User.findById(userId)

        if (!user) {
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
                data: user.toJSON()
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

        const user = await User.findOne({ email })

        if (user) {
            res.status(400).json(
                getResponse({
                    message: ErrorMessages.EMAIL_ALREADY_EXISTS
                })
            )
            return
        }

        const verifyToken = uuidv4()

        const expiredAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

        const existingToken = await VerifyToken.findOne({ email })

        if (existingToken) {
            existingToken.token = verifyToken
            existingToken.expiredAt = expiredAt
            await existingToken.save()
        } else {
            const verifyTokenDoc = await VerifyToken.create({
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

export const createUser = async (req: Request, res: Response) => {
    try {
        const { token, loginName, password, firstName, lastName, description, location, occupation } = req.body

        const tokenDoc = await VerifyToken.findOne({ token })

        if (!tokenDoc || tokenDoc.expiredAt < new Date()) {
            res.status(400).json(
                getResponse({
                    message: 'Token is invalid!'
                })
            )
            return
        }

        const user = await User.findOne({ loginName })

        if (user) {
            res.status(400).json(
                getResponse({
                    message: ErrorMessages.LOGIN_NAME_ALREADY_EXISTS
                })
            )
            return
        }

        const newUser = new User({
            email: tokenDoc.email,
            loginName,
            password,
            firstName,
            lastName,
            description,
            location,
            occupation
        })

        await newUser.save()

        await VerifyToken.deleteOne({ _id: tokenDoc._id })

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
