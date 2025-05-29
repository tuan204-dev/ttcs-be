/* eslint-disable @typescript-eslint/ban-ts-comment */
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const auth = {
    type: 'OAuth2',
    user: 'contact.tuandang@gmail.com',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
}

const transporter = nodemailer.createTransport({
    // @ts-ignore
    service: 'gmail',
    auth: auth
})

const getHtmlTemplate = (name: string, verifyLink: string) => {
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - Photo App</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>

<body style="font-family: 'Inter', sans-serif; background-color: #f8fafc; margin: 0; padding: 0; color: #334155;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div
            style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
            <div style="text-align: center; padding: 32px 0;">
                <div style="font-size: 24px; font-weight: 700; color: #6366f1; letter-spacing: -0.5px;">Photo App</div>
            </div>

            <div style="padding: 0 32px 32px;">
                <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 24px; margin-top: 0;">Hi ${name},</h1>
                <p style="margin-bottom: 24px; margin-top: 0;">Thank you for signing up for Photo App! We're excited to
                    have you join our community of
                    photographers and creatives.</p>

                <p style="margin-bottom: 32px; margin-top: 0;">To complete your registration and start sharing your
                    photos, please click the button
                    below to verify your email address:</p>

                <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${verifyLink}"
                        style="background-color: #6366f1; color: white; text-decoration: none; font-weight: 500; padding: 12px 24px; border-radius: 8px; display: inline-block;">Verify
                        Email</a>
                </div>


                <p style="color: #475569; margin-bottom: 0; margin-top: 0;">This link will expire in 1 hours. If you
                    didn't request this email, you can
                    safely ignore it.</p>
            </div>

            <div
                style="padding: 24px 32px; text-align: center; color: #64748b; font-size: 14px; border-top: 1px solid #e2e8f0;">
                <p style="margin-bottom: 8px; margin-top: 0;">© 2025 Photo App. All rights reserved.</p>
                <p style="margin-bottom: 0; margin-top: 0;">If you did not create an account, please ignore this email.
                </p>
            </div>
        </div>
    </div>
</body>

</html>`
}

interface SendVerifyEmailParams {
    email: string
    name: string
    verifyLink: string
}

export const sendVerifyEmail = async ({ email, name, verifyLink }: SendVerifyEmailParams) => {
    const mailOptions = {
        from: 'contact.tuandang@gmail.com',
        to: email,
        subject: 'Verify Your Email - Photo App',
        html: getHtmlTemplate(name, verifyLink)
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log('Verification email sent successfully')
    } catch (error) {
        console.error('Error sending verification email:', error)
        throw new Error('Failed to send verification email')
    }
}