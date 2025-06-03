import mongoose, { Document, Schema } from 'mongoose'

export interface IBookmark extends Document {
    jobId: mongoose.Types.ObjectId
    workerId: mongoose.Types.ObjectId
    expiredAt: Date
}

const bookmarkSchema = new Schema<IBookmark>(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true
        },
        workerId: {
            type: Schema.Types.ObjectId,
            ref: 'Worker',
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Bookmark = mongoose.model<IBookmark>('Bookmark', bookmarkSchema)

export default Bookmark
