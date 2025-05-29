import Joi from 'joi'
import { locationSchema } from '~/types/ILocation'
import { salaryRangeSchema } from '~/types/job'
import { skillSchema } from '~/types/skill'

export const createJobSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(5000).required(),
    location: locationSchema.required(),
    salaryRange: salaryRangeSchema.required(),
    jobType: Joi.number().required(),
    skillRequired: Joi.array().items(skillSchema).default([]),
    companyId: Joi.string().required()
})

export const editJobSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(5000).required(),
    location: locationSchema.required(),
    salaryRange: salaryRangeSchema.required(),
    jobType: Joi.number().required(),
    skillRequired: Joi.array().items(skillSchema).default([])
})
