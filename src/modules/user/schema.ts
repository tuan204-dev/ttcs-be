import Joi from 'joi'

export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    loginName: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    location: Joi.string().max(100).optional().allow(''),
    description: Joi.string().max(500).optional().allow(''),
    occupation: Joi.string().max(100).optional().allow('')
})

export const updateUserSchema = Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    location: Joi.string().max(100).optional().allow(''),
    description: Joi.string().max(500).optional().allow(''),
    occupation: Joi.string().max(100).optional().allow('')
})
