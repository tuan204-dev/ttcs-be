import { IResponse } from '../types/ICommon'

interface IResponseParams<T> {
    data?: T | null
    message?: string
}

export const getResponse = <T>({ data = null, message }: IResponseParams<T>): IResponse<T | null> => {
    return {
        success: !!data,
        message: message || (data ? 'Success' : 'Failed'),
        data: data as T | null
    }
}

export const isEmail = (str: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(str)
}
