import { Request, Response } from 'express'
import User from '~/db/models/userModel'
import { getResponse } from '~/utils/common'
import { ICreateUser, IUpdateUser } from './type'
import Comment from '~/db/models/commentModel'
import { omit } from 'lodash'

export const createUser = async (req: Request<unknown, unknown, ICreateUser>, res: Response) => {
    try {
        const { email, loginName, password, firstName, lastName, description, location, occupation } = req.body

        const user = await User.findOne({ email })

        if (user) {
            res.status(400).json({ message: 'User already exists' })
            return
        }

        const newUser = new User({
            email,
            loginName,
            password,
            firstName,
            lastName,
            description,
            location,
            occupation
        })

        newUser.save()

        res.status(201).json({ message: 'User created successfully' })
    } catch (e) {
        console.error('Error creating user:', e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const updateUser = async (req: Request<unknown, unknown, IUpdateUser>, res: Response) => {
    try {
        const userId = req.user?.id

        const user = await User.findById(userId)

        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...req.body
            },
            {
                new: true,
                runValidators: true
            }
        )

        res.status(200).json(
            getResponse({
                message: 'User updated',
                data: updatedUser?.toJSON()
            })
        )
    } catch (e) {
        console.error('Error updating user:', e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getAllUser = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 1000 } = req.query

        const users = await User.find({})
            .select('-password -__v -createdAt -updatedAt')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))

        const totalUsers = await User.countDocuments({})

        res.status(200).json(
            getResponse({
                message: 'Users retrieved successfully',
                data: {
                    data: users.map((user) => user.toJSON()),
                    total: totalUsers,
                    page: Number(page),
                    limit: Number(limit)
                }
            })
        )
    } catch (e) {
        console.error('Error getting all users:', e)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const getUserDetail = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id

        const user = await User.findById(userId)

        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }

        res.status(200).json(
            getResponse({
                message: 'User detail retrieved successfully',
                data: user.toJSON()
            })
        )
    } catch (e) {
        console.log('Error getting user detail:', e)
        res.status(500).json(
            getResponse({
                message: 'Get user detail failed'
            })
        )
    }
}

export const getAllCommentByUserId = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id
        const { page = 1, limit = 1000 } = req.query

        const user = await User.findById(userId)

        if (!user) {
            res.status(404).json(
                getResponse({
                    message: 'User not found'
                })
            )
            return
        }

        const comments = await Comment.find({ userId })
            .populate('postId', 'title imageUrl _id')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))

        const totalComments = await Comment.countDocuments({ userId })

        res.status(200).json(
            getResponse({
                message: 'Comments retrieved successfully',
                data: {
                    data: comments.map((comment) => {
                        const commentData = comment.toJSON()

                        return {
                            ...omit(commentData, ['postId']),
                            post: commentData.postId
                        }
                    }),
                    total: totalComments,
                    page: Number(page),
                    limit: Number(limit)
                }
            })
        )
    } catch (e) {
        console.error('Error getting comments by user ID:', e)
        res.status(500).json(
            getResponse({
                message: 'Internal server error'
            })
        )
    }
}
