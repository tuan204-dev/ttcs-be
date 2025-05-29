import Joi from "joi"

export interface ILocation {
    province: string
    district: string
    ward: string
}

export const locationSchema = Joi.object({
    province: Joi.string().required(),
    district: Joi.string().required(),
    ward: Joi.string().required()
})