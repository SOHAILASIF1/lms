import { getToken } from 'next-auth/jwt'

export async function getSession(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return null

  return {
    user: {
      id: token.id,
      name: token.name,
      email: token.email,
      image: token.picture || token.image || null,
    },
  }
}
