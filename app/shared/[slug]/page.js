'use client'

import { useEffect, useState } from 'react'

export default function SharedPage({ params }) {
  const [note, setNote] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/shared/${params.slug}`)
      if (!res.ok) {
        setError('Note not found.')
        return
      }
      setNote(await res.json())
    }
    load()
  }, [params.slug])

  if (error) {
    return <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center text-slate-600 shadow-sm">{error}</div>
  }

  if (!note) {
    return <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">Loading shared note…</div>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-semibold">{note.title}</h1>
        <p className="mt-4 text-sm text-slate-500">Shared publicly</p>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: note.content || '<p>No content yet.</p>' }} />
      </div>
    </div>
  )
}
