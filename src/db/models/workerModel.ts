import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose, { Document, Schema } from 'mongoose'
import { Gender } from '~/constants/enum'
import { ISkill } from '~/types/skill'

export interface IWorker extends Document {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    gender: Gender
    location?: string
    avatar?: string
    education?: string
    skills?: ISkill[]
    isOpenToOffer?: boolean
    dateOfBirth: Date
    description?: string
    careerOrientation?: string
    createdAt: Date
    updatedAt: Date

    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>
    genJWTAccessToken(): string
}

// Schema định nghĩa cấu trúc collection
const workerSchema = new Schema<IWorker>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        phone: {
            type: String,
            trim: true,
            maxlength: 15,
            default: ''
        },
        gender: {
            type: Number,
            default: Gender.UNKNOWN
        },
        location: {
            type: String,
            trim: true,
            maxlength: 100,
            default: ''
        },
        avatar: {
            type: String,
            trim: true,
            default: ''
        },
        education: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },
        skills: {
            type: [
                {
                    name: { type: String, required: true, trim: true, maxlength: 50 },
                    level: { type: Number, required: true, default: 1 } // Giả sử level là số từ 1 đến 5
                }
            ],
            default: []
        },
        isOpenToOffer: {
            type: Boolean,
            default: true
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: ''
        },
        careerOrientation: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        }
    },
    {
        timestamps: true, // Tự động tạo createdAt và updatedAt
        versionKey: false
    }
)

// Index để tối ưu hóa truy vấn
workerSchema.index({ email: 1 })

// Middleware để hash password trước khi save
workerSchema.pre('save', async function (next) {
    // Chỉ hash password khi password được thay đổi
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error as Error)
    }
})

// Method để so sánh password
workerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
}

// Method để tạo JWT access token
workerSchema.methods.genJWTAccessToken = function (): string {
    const payload = {
        id: this._id,
        email: this.email
    }

    const secretKey = process.env.WORKER_JWT_ACCESS_TOKEN_SECRET

    if (!secretKey) {
        throw new Error('JWT secret key is not defined')
    }

    const accessToken = jwt.sign(payload, secretKey, {
        expiresIn: '1h'
    })

    return accessToken
}

// Transform để loại bỏ password khỏi JSON response
workerSchema.methods.toJSON = function () {
    const workerObject = this.toObject()
    delete workerObject.password
    return workerObject
}

// Tạo và export model
const Worker = mongoose.model<IWorker>('Worker', workerSchema)

export default Worker
