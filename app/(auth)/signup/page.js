'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Unable to sign up.')
      return
    }

    router.push('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-3xl font-semibold">Create your account</h1>
        <p className="mb-6 text-slate-500">Start organizing notes in seconds.</p>
        {error ? <div className="mb-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label className="block text-sm font-medium text-slate-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <button type="submit" className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-white">Sign Up</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-slate-900">Sign in</a>
        </p>
      </div>
    </div>
  )
}
