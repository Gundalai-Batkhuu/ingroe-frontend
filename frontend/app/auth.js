import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { getStringFromBuffer } from './lib/utils'
import { getUser } from './app/login/actions'

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        const email = credentials.email
        const password = credentials.password

        if (typeof email !== 'string' || !email.includes('@') || typeof password !== 'string' || password.length < 6) {
          return null
        }

        const user = await getUser(email)

        if (!user) return null

        const encoder = new TextEncoder()
        const saltedPassword = encoder.encode(password + user.salt)
        const hashedPasswordBuffer = await crypto.subtle.digest(
          'SHA-256',
          saltedPassword
        )
        const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

        if (hashedPassword === user.password) {
          return user
        } else {
          return null
        }
      }
    })
  ]
})