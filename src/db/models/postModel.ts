import mongoose, { Document, Schema } from 'mongoose'

export interface IPost extends Document {
    title: string
    imageUrl: string
    userId: mongoose.Types.ObjectId
    likes?: mongoose.Types.ObjectId[]
    commentCount?: number
    createdAt: Date
    updatedAt: Date
}


const postSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 100
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            default: [],
            ref: 'User'
        },
        commentCount: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Post = mongoose.model<IPost>('Post', postSchema)

export default Post
