'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NoteCard from '../../../../components/NoteCard'

export default function FolderPage({ params }) {
  const [notes, setNotes] = useState([])
  const [folder, setFolder] = useState(null)
  const [folders, setFolders] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const [notesRes, foldersRes] = await Promise.all([fetch('/api/notes'), fetch('/api/folders')])
      if (notesRes.ok) {
        const allNotes = await notesRes.json()
        setNotes(allNotes.filter((note) => note.folderId === params.id))
      }
      if (foldersRes.ok) {
        const list = await foldersRes.json()
        setFolders(list)
        setFolder(list.find((item) => item._id === params.id))
      }
    }
    load()
  }, [params.id])

  const trashNote = async (id) => {
    await fetch(`/api/notes/${id}/trash`, { method: 'PATCH' })
    setNotes((current) => current.filter((note) => note._id !== id))
  }

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm text-slate-500">Folder</p>
        <h1 className="text-3xl font-semibold">{folder?.name || 'Folder'}</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {notes.length ? (
          notes.map((note) => (
            <NoteCard key={note._id} note={note} folders={folders} onDelete={trashNote} onOpen={(id) => router.push(`/notes/${id}`)} onMoveToFolder={() => {}} />
          ))
        ) : (
          <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">No notes in this folder yet.</div>
        )}
      </div>
    </div>
  )
}
