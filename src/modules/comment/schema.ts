import Joi from 'joi'

export const commentSchema = Joi.object({
    content: Joi.string().required().max(500)
})

export const getCommentsSchema = Joi.object({
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(1000)
})
