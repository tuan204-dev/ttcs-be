import Joi from "joi"

export interface ISkill {
    name: string
    level: number
}

export const skillSchema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    level: Joi.number().integer().min(1).max(5).required()
})