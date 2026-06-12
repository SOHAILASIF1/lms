import NextAuth from 'next-auth'
import authHandler from '../../../../lib/auth'

const handler = NextAuth(authHandler.authOptions)

export { handler as GET, handler as POST }
