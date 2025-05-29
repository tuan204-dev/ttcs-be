import Joi from 'joi'

export const createPostSchema = Joi.object({
    title: Joi.string().required().max(100).min(3),
    imageUrl: Joi.string().required().uri()
})

export const findOnePostSchema = Joi.object({
    id: Joi.string().required().id()
})

export const getPostByConditionSchema = Joi.object({
    title: Joi.string().optional().max(100),
    authorId: Joi.string().optional().id(),
    page: Joi.number().optional().default(1),
    limit: Joi.number().optional().default(1000)
})