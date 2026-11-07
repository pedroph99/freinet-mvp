import 'dotenv/config'
import jwt, { SignOptions } from 'jsonwebtoken'
import { StringValue } from 'ms'


export const generateAccessToken = (user: {
  id: number
  email: string
  role: string
}): string => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error('JWT_SECRET is not defined')
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '1d') as StringValue,
    subject: String(user.id),
  }

  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    secret,
    options
  )

  return token
}

export const verifyAccessToken = (token: string): any => {
  const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('JWT_SECRET is not defined')
    }

    try {
        const decoded = jwt.verify(token, secret)
        return decoded
    } catch (error) {
        throw new Error('Invalid or expired token')
    }
}