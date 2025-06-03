import { JobType } from '~/constants/enum'
import { ILocation } from '~/types/ILocation'
import { ISalaryRange } from '~/types/job'
import { ISkill } from '~/types/skill'

export interface ICreateJob {
    title: string
    description: string
    location: ILocation
    salaryRange: ISalaryRange
    jobType: JobType
    skillRequired: ISkill[]
    responsibilities: string[]
    requirements: string[]
    benefits: string[]
    companyId: string
}

export interface IEditJob {
    title: string
    description: string
    location: ILocation
    salaryRange: ISalaryRange
    jobType: JobType
    skillRequired: ISkill[]
}

export interface GetJobsQuery {
    recruiterId?: string
    companyId?: string
    title?: string
    jobType?: JobType | JobType[]
    recruitingStatus?: RecordingState | RecordingState[]
}