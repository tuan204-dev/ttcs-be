import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = parseInt(process.env.SALT_ROUNDS ?? '12', 10)
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword)
}
