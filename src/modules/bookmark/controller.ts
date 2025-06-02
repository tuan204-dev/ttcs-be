import { Request, Response } from 'express'
import { RecruitingStatus } from '~/constants/enum'
import Bookmark from '~/db/models/bookmarkModel'
import Job from '~/db/models/jobModel'
import { getResponse } from '~/utils/common'

export const addBookmark = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.id
        const workerId = req.user?.id

        const job = await Job.findById(jobId)

        if (!job) {
            res.status(404).json(
                getResponse({
                    message: 'Job not found'
                })
            )
        }

        const existingBookmark = await Bookmark.findOne({
            jobId,
            workerId
        })

        if (existingBookmark) {
            res.status(400).json(
                getResponse({
                    message: 'Bookmark already exists'
                })
            )
            return
        }

        const bookmark = await Bookmark.create({
            jobId,
            workerId
        })

        res.status(201).json(
            getResponse({
                message: 'Bookmark added successfully',
                data: bookmark.toObject()
            })
        )
    } catch (e) {
        console.log('Bookmark error:', e)
        res.status(500).json(
            getResponse({
                message: 'Failed to add bookmark'
            })
        )
    }
}

export const removeBookmark = async (req: Request, res: Response) => {
    try {
        const jobId = req.params.id
        const workerId = req.user?.id

        const bookmark = await Bookmark.findOneAndDelete({
            jobId,
            workerId
        })

        if (!bookmark) {
            res.status(404).json(
                getResponse({
                    message: 'Bookmark not found'
                })
            )
            return
        }

        res.status(200).json(
            getResponse({
                message: 'Bookmark removed successfully',
                success: true
            })
        )
    } catch (e) {
        console.log('Bookmark error:', e)
        res.status(500).json(
            getResponse({
                message: 'Failed to remove bookmark'
            })
        )
    }
}

export const getBookmarks = async (req: Request, res: Response) => {
    try {
        const workerId = req.user?.id

        const bookmarks = await Bookmark.find({ workerId }).populate('jobId').exec()

        res.status(200).json(
            getResponse({
                data: bookmarks
                    .map((bookmark) => bookmark.toObject())
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    ?.filter((bookmark) => bookmark.jobId?.recruitingStatus === RecruitingStatus.PUBLIC)
            })
        )
    } catch (e) {
        console.log('Bookmark error:', e)
        res.status(500).json(
            getResponse({
                message: 'Failed to retrieve bookmarks'
            })
        )
    }
}
