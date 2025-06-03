export enum SENDER_TYPE {
    WORKER = 'worker',
    RECRUITER = 'recruiter'
}

export interface IMessage {
    _id: string
    senderType: SENDER_TYPE
    content: string
    createdAt: Date
}