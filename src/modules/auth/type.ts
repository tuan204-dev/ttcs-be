

export interface ILoginUser {
    loginName: string
    password: string
}

export interface ILgoutUser {
    refreshToken: string
}

export interface IRefreshTokenRequest {
    refreshToken: string
}