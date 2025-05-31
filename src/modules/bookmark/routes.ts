import { Router } from 'express'
import { workerAuthentication } from '~/middlewares/auth'
import { addBookmark, getBookmarks, removeBookmark } from './controller'

const bookmarkRoutes = Router()

bookmarkRoutes.get('/', workerAuthentication, getBookmarks)
bookmarkRoutes.post('/:id', workerAuthentication, addBookmark)
bookmarkRoutes.delete('/:id', workerAuthentication, removeBookmark)

export default bookmarkRoutes
