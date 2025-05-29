export interface ICreateUser {
    email: string
    loginName: string
    password: string
    firstName: string
    lastName: string
    location?: string
    description?: string
    occupation?: string
}

export interface IUpdateUser {
    firstName?: string
    lastName?: string
    location?: string
    description?: string
    occupation?: string
}