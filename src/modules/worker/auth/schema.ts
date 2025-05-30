import Joi from 'joi'
import { locationSchema } from '~/types/ILocation'
import { skillSchema } from '~/types/skill'

export const loginWorkerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
})

export const logoutWorkerSchema = Joi.object({
    refreshToken: Joi.string().required()
})

export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required()
})

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required()
})

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().min(8).required()
})

export const sendVerifyEmailSchema = Joi.object({
    email: Joi.string().email().required()
})

export const createWorkerSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(1).max(50).required(),
    lastName: Joi.string().min(1).max(50).required(),
    phone: Joi.string().min(10).max(15).optional(),
    location: locationSchema.optional(),
    gender: Joi.number().optional(),
    avatar: Joi.string().uri().optional(),
    education: Joi.string().optional(),
    skills: Joi.array().items(skillSchema).default([]).optional()
})
