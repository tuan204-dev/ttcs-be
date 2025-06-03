import { Request, Response } from 'express'
import Recruiting from '~/db/models/recruitingModel'
import Worker from '~/db/models/workerModel'
import { SENDER_TYPE } from '~/types/message'
import { getResponse } from '~/utils/common'

export const getAllRecruiting = async (req: Request, res: Response) => {
    try {
        const workerId = req.user?.id

        const worker = await Worker.findById(workerId)

        if (!worker) {
            res.status(404).json(
                getResponse({
                    success: false,
                    message: 'Worker not found.'
                })
            )
            return
        }

        const recruitingList = await Recruiting.find({ workerId })
            .select('-messages')
            .populate({
                path: 'jobId',
                populate: {
                    path: 'recruiterId'
                }
            })

        res.status(200).json(
            getResponse({
                message: 'recruitingList fetched successfully.',
                data: recruitingList.map((rec) => {
                    const data = rec.toObject()

                    const job = data.jobId
                        ? {
                            ...data.jobId,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            recruiter: data.jobId?.recruiterId ? data.jobId.recruiterId : null,
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            recruiterId: undefined
                        }
                        : null

                    return {
                        ...data,
                        job,
                        jobId: undefined
                    }
                })
            })
        )
    } catch (e) {
        console.error(e)
        res.status(500).json(
            getResponse({
                success: false,
                message: 'An error occurred while fetching recruitings.'
            })
        )
    }
}

export const workerSendMessage = async (req: Request, res: Response) => {
    try {
        const workerId = req.user?.id
        const { recruitingId, content } = req.body

        const recruiting = await Recruiting.findById(recruitingId)

        if (!recruiting || String(recruiting.workerId) !== String(workerId)) {
            res.status(404).json(
                getResponse({
                    success: false,
                    message: 'Recruiting not found or you do not have permission to send a message.'
                })
            )
            return
        }

        const message = {
            senderType: SENDER_TYPE.WORKER,
            content: content.trim(),
            createdAt: new Date()
        }

        await Recruiting.updateOne(
            { _id: recruitingId },
            {
                $push: {
                    messages: message
                },
                lastMessage: message
            }
        )

        res.status(200).json(
            getResponse({
                success: true,
                message: 'Message sent successfully.'
            })
        )
    } catch (e) {
        console.error(e)
        res.status(500).json(
            getResponse({
                success: false,
                message: 'An error occurred while sending the message.'
            })
        )
    }
}

export const recruiterSendMessage = async (req: Request, res: Response) => {
    try {
        const recruiterId = req.user?.id
        const { recruitingId, content } = req.body

        const recruiting = await Recruiting.findById(recruitingId).populate('jobId')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!recruiting || String(recruiting.jobId.recruiterId) !== String(recruiterId)) {
            res.status(404).json(
                getResponse({
                    success: false,
                    message: 'Recruiting not found or you do not have permission to send a message.'
                })
            )
            return
        }

        const message = {
            senderType: SENDER_TYPE.RECRUITER,
            content: content.trim(),
            createdAt: new Date()
        }

        await Recruiting.updateOne(
            { _id: recruitingId },
            {
                $push: {
                    messages: message
                },
                lastMessage: message
            }
        )

        res.status(200).json(
            getResponse({
                success: true,
                message: 'Message sent successfully.'
            })
        )
    } catch (e) {
        console.error(e)
        res.status(500).json(
            getResponse({
                success: false,
                message: 'An error occurred while sending the message.'
            })
        )
    }
}

export const getRecruitingDetail = async (req: Request, res: Response) => {
    try {
        const recruitingId = req.params.id
        const userId = req.user?.id

        const recruiting = await Recruiting.findById(recruitingId)
            .populate({
                path: 'jobId',
                populate: {
                    path: 'recruiterId',
                    select: '-password'
                }
            })
            .populate({
                path: 'workerId',
                select: '-password'
            })

        if (
            !recruiting ||
            (String(recruiting.workerId._id) !== String(userId) &&
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                String(recruiting.jobId.recruiterId._id) !== String(userId))
        ) {
            res.status(404).json(
                getResponse({
                    success: false,
                    message: 'Recruiting not found.'
                })
            )
            return
        }

        const recruitingData = recruiting.toObject()

        const result = {
            ...recruitingData,
            job: recruitingData.jobId,
            worker: recruitingData.workerId,
            jobId: undefined,
            workerId: undefined
        }

        res.status(200).json(
            getResponse({
                message: 'Messages fetched successfully.',
                data: result
            })
        )
    } catch (e) {
        console.error(e)
        res.status(500).json(
            getResponse({
                success: false,
                message: 'An error occurred while fetching messages.'
            })
        )
    }
}
