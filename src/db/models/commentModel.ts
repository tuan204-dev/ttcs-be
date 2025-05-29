import mongoose, { Document } from 'mongoose'

export interface IComment extends Document {
    content: string
    postId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

// Schema định nghĩa cấu trúc collection
const commentSchema = new mongoose.Schema<IComment>(
    {
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Post'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Comment = mongoose.model<IComment>('Comment', commentSchema)

export default Comment
