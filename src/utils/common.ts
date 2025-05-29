import { IResponse } from '../types/ICommon'

interface IResponseParams<T> {
    data?: T | null
    message?: string
    success?: boolean
}

export const getResponse = <T>({ data = null, message, success }: IResponseParams<T>): IResponse<T | null> => {
    return {
        success: success !== undefined ? success : !!data,
        message: message || (data ? 'Success' : 'Failed'),
        data: data as T | null
    }
}

export const isEmail = (str: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(str)
}
