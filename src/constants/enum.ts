

export enum Gender {
    UNKNOWN = 0,
    MALE = 1,
    FEMALE = 2,
    OTHER = 3
}

export enum RecruitingStatus {
    DRAFT = 0,
    PUBLIC = 1,
    PAUSED = 2,
    CLOSED = 3
}

export enum JobType {
    FULL_TIME = 0,
    PART_TIME = 1,
    FREELANCE = 2,
    CONTRACT = 3
}

export enum RecruitingProgress {
    APPLIED = 0,
    DOCUMENT_READING = 1,
    INTERVIEW = 2,
    TECH_ASSESSMENT = 3,
    OFFER = 4,
    HIRED = 5,
    REJECTED = -1
}