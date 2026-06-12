'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    })

    if (result.error) {
      setError('Invalid email or password.')
      return
    }
    router.push('/notes')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-semibold">Welcome back</h1>
        <p className="mb-6 text-slate-500">Sign in to access your notes.</p>
        <button type="button" className="mb-4 w-full rounded-3xl bg-slate-900 px-5 py-3 text-white" onClick={() => signIn('github')}>
          Continue with GitHub
        </button>
        <div className="mb-4 flex items-center gap-3 text-sm text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span>or</span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>
        {error ? <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-white">Sign In</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-semibold text-slate-900">Create one</a>
        </p>
      </div>
    </div>
  )
}
