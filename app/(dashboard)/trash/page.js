'use client'

import { useEffect, useState } from 'react'
import NoteCard from '../../../components/NoteCard'

export default function TrashPage() {
  const [notes, setNotes] = useState([])
  const [folders, setFolders] = useState([])

  useEffect(() => {
    async function load() {
      const [notesRes, foldersRes] = await Promise.all([
        fetch('/api/notes?trashed=true'),
        fetch('/api/folders'),
      ])
      if (notesRes.ok) {
        setNotes(await notesRes.json())
      }
      if (foldersRes.ok) {
        setFolders(await foldersRes.json())
      }
    }
    load()
  }, [])

  const restoreNote = async (id) => {
    await fetch(`/api/notes/${id}/restore`, { method: 'PATCH' })
    setNotes((current) => current.filter((note) => note._id !== id))
  }

  const deleteNote = async (id) => {
    await fetch(`/api/notes/${id}/permanent`, { method: 'DELETE' })
    setNotes((current) => current.filter((note) => note._id !== id))
  }

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm text-slate-500">Trashed notes</p>
        <h1 className="text-3xl font-semibold">Trash</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.length ? (
          notes.map((note) => (
            <div key={note._id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{note.title}</h3>
                  <p className="mt-2 text-sm text-slate-500">{note.content.replace(/<[^>]+>/g, ' ').slice(0, 120)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className="small secondary" onClick={() => restoreNote(note._id)}>
                  Restore
                </button>
                <button type="button" className="small bg-rose-600 text-white" onClick={() => deleteNote(note._id)}>
                  Delete forever
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">Trash is empty.</div>
        )}
      </div>
    </div>
  )
}
