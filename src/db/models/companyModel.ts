import mongoose, { Document, Schema } from 'mongoose'
import { ILocation } from '~/types/ILocation'

export interface ICompany extends Document {
    name: string
    location: ILocation
    expiredAt: Date
    updatedAt: Date
}

const companySchema = new Schema<ICompany>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: {
                province: { type: String, required: true, trim: true, maxlength: 100 },
                district: { type: String, required: true, trim: true, maxlength: 100 },
                ward: { type: String, required: true, trim: true, maxlength: 100 }
            },
            default: {}
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Company = mongoose.model<ICompany>('Company', companySchema)

export default Company
