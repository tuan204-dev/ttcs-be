import { Router } from 'express'
import { authentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import { createUserSchema, updateUserSchema } from './schema'
import { createUser, getAllCommentByUserId, getAllUser, getUserDetail, updateUser } from './controller'

const userRoutes = Router()

userRoutes.get('/', authentication, getAllUser)
userRoutes.get('/:id', authentication, getUserDetail)
userRoutes.get('/:id/comment', authentication, getAllCommentByUserId)
userRoutes.post('/register', validateBody(createUserSchema), createUser)
userRoutes.put('/update-profile', authentication, validateBody(updateUserSchema), updateUser)

export default userRoutes
