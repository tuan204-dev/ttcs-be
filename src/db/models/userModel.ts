import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// Interface định nghĩa cấu trúc của User document
export interface IUser extends Document {
    email: string
    loginName: string
    password: string
    firstName: string
    lastName: string
    location?: string
    description?: string
    occupation?: string
    createdAt: Date
    updatedAt: Date

    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>
    genJWTAccessToken(): string
}

// Schema định nghĩa cấu trúc collection
const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        loginName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 20
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
        location: {
            type: String,
            trim: true,
            maxlength: 100,
            default: ''
        },
        description: {
            type: String,
            trim: true,
            maxlength: 500,
            default: ''
        },
        occupation: {
            type: String,
            trim: true,
            maxlength: 100,
            default: ''
        }
    },
    {
        timestamps: true, // Tự động tạo createdAt và updatedAt
        versionKey: false
    }
)

// Index để tối ưu hóa truy vấn
userSchema.index({ loginName: 1 })

// Middleware để hash password trước khi save
userSchema.pre('save', async function (next) {
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
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
}

// Method để tạo JWT access token
userSchema.methods.genJWTAccessToken = function (): string {
    const payload = {
        id: this._id,
        loginName: this.loginName
    }

    const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET

    if (!secretKey) {
        throw new Error('JWT secret key is not defined')
    }

    const accessToken = jwt.sign(payload, secretKey, {
        expiresIn: '1h'
    })

    return accessToken
}

// Transform để loại bỏ password khỏi JSON response
userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    return userObject
}

// Tạo và export model
const User = mongoose.model<IUser>('User', userSchema)

export default User
