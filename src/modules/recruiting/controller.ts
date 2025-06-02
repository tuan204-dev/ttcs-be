import { Request, Response } from 'express'
import Recruiting from '~/db/models/recruitingModel'
import Worker from '~/db/models/workerModel'
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

        const recruitingList = await Recruiting.find({ workerId }).populate({
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
