import Joi from 'joi'

export const sendMessageSchema = Joi.object({
    recruitingId: Joi.string().required(),
    content: Joi.string().required().trim()
})
