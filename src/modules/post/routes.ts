import { Router } from 'express'
import { authentication } from '~/middlewares/auth'
import { validateBody, validateParams } from '~/middlewares/validation'
import commentRoutes from '../comment/routes'
import { createPost, findOne, getPostByCondition, likePost, unLikePost } from './controller'
import { createPostSchema, findOnePostSchema } from './schema'

const postRoutes = Router()

postRoutes.get('/', authentication, getPostByCondition)
postRoutes.post('/', authentication, validateBody(createPostSchema), createPost)
postRoutes.get('/:id', authentication, validateParams(findOnePostSchema), findOne)
postRoutes.post('/:id/like', authentication, validateParams(findOnePostSchema), likePost)
postRoutes.delete('/:id/like', authentication, validateParams(findOnePostSchema), unLikePost)
postRoutes.use('/:id', authentication, validateParams(findOnePostSchema), commentRoutes)

export default postRoutes
