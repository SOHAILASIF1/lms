'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import NoteCard from '../../../components/NoteCard'

export default function NotesPage() {
  const params = useSearchParams()
  const router = useRouter()
  const [notes, setNotes] = useState([])
  const [folders, setFolders] = useState([])
  const [filter, setFilter] = useState(params.get('filter') || '')
  const [query, setQuery] = useState(params.get('q') || '')

  const load = async () => {
    const url = query ? `/api/notes/search?q=${encodeURIComponent(query)}` : '/api/notes'
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      setNotes(data)
    }
  }

  useEffect(() => {
    load()
    fetch('/api/folders').then((res) => res.ok && res.json().then(setFolders))
  }, [query])

  useEffect(() => {
    setFilter(params.get('filter') || '')
  }, [params])

  const filtered = notes.filter((note) => {
    if (filter === 'pinned') return note.isPinned
    if (filter === 'starred') return note.isStarred
    return true
  })

  const trashNote = async (id) => {
    await fetch(`/api/notes/${id}/trash`, { method: 'PATCH' })
    setNotes((current) => current.filter((note) => note._id !== id))
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">All notes</p>
          <h1 className="text-3xl font-semibold">Your library</h1>
        </div>
        <button type="button" className="rounded-3xl bg-slate-900 px-5 py-3 text-white" onClick={() => router.push('/notes/new')}>
          New Note
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length ? (
          filtered.map((note) => (
            <NoteCard key={note._id} note={note} folders={folders} onDelete={trashNote} onOpen={(id) => router.push(`/notes/${id}`)} onMoveToFolder={() => {}} />
          ))
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center text-slate-500 shadow-sm">No notes found.</div>
        )}
      </div>
    </div>
  )
}
