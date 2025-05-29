import { Router } from 'express'
import { validateBody } from '~/middlewares/validation'
import { createComment, getCommentsByPostId } from './controller'
import { commentSchema } from './schema'

const commentRoutes = Router({ mergeParams: true })

commentRoutes.post('/comment', validateBody(commentSchema), createComment)
commentRoutes.get('/comment', getCommentsByPostId)

export default commentRoutes
