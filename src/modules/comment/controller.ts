import { Request, Response } from 'express'
import { omit } from 'lodash'
import Comment from '~/db/models/commentModel'
import Post from '~/db/models/postModel'
import { getResponse } from '~/utils/common'

export const createComment = async (req: Request, res: Response) => {
    try {
        const content = req.body.content
        const postId = req.params.id
        const userId = req.user?.id

        const post = await Post.findById(postId)

        if (!post) {
            res.status(404).json(
                getResponse({
                    message: 'Post not found'
                })
            )
            return
        }

        const comment = await Comment.create({
            content,
            postId,
            userId
        })

        await comment.save()

        await post.updateOne({ $inc: { commentCount: 1 } })

        res.status(201).json(
            getResponse({
                message: 'Comment created successfully',
                data: comment.toJSON()
            })
        )
    } catch (e) {
        console.error('Error creating comment:', e)
        res.status(500).json(
            getResponse({
                message: 'Comment creation failed'
            })
        )
    }
}

export const getCommentsByPostId = async (req: Request, res: Response) => {
    try {
        const postId = req.params.id
        const { page = 1, limit = 1000 } = req.query

        const post = await Post.findById(postId)

        if (!post) {
            res.status(404).json(
                getResponse({
                    message: 'Post not found'
                })
            )
            return
        }

        const comments = await Comment.find({ postId })
            .populate('userId', 'firstName lastName loginName')
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))

        const totalComments = await Comment.countDocuments({ postId })

        res.status(200).json(
            getResponse({
                message: 'Comments retrieved successfully',
                data: {
                    data: comments.map((comment) => {
                        const commentData = comment.toJSON()

                        return {
                            ...omit(commentData, ['userId']),
                            user: commentData.userId
                        }
                    }),
                    total: totalComments,
                    page
                }
            })
        )
    } catch (e) {
        console.log('Error getting comments by post ID:', e)
        res.status(500).json(
            getResponse({
                message: 'Internal server error'
            })
        )
    }
}
