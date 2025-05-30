

export interface ILoginUser {
    email: string
    password: string
}

export interface ILogoutUser {
    refreshToken: string
}

export interface IRefreshTokenRequest {
    refreshToken: string
}