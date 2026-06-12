'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Editor from '../../../../components/Editor'

export default function NoteEditorPage({ params }) {
  const router = useRouter()
  const [note, setNote] = useState(null)
  const [folders, setFolders] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      const [noteRes, folderRes] = await Promise.all([
        fetch(`/api/notes/${params.id}`),
        fetch('/api/folders'),
      ])
      if (noteRes.ok) {
        setNote(await noteRes.json())
      }
      if (folderRes.ok) {
        setFolders(await folderRes.json())
      }
    }
    load()
  }, [params.id])

  const saveNote = async (payload) => {
    if (!note) return
    setSaving(true)
    await fetch(`/api/notes/${note._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(false)
  }

  const handleShare = async () => {
    if (!note) return
    const res = await fetch(`/api/notes/${note._id}/share`, { method: 'PATCH' })
    if (res.ok) {
      const data = await res.json()
      setNote(data)
      alert(`Shared link created: ${window.location.origin}/shared/${data.publicSlug}`)
    }
  }

  const handleExport = async () => {
    if (!note) return
    const res = await fetch(`/api/notes/${note._id}/export`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `${note.title || 'note'}.pdf`
      anchor.click()
      URL.revokeObjectURL(url)
    }
  }

  if (!note) {
    return <div className="rounded-3xl bg-white p-10 shadow-sm">Loading note…</div>
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Note editor</p>
          <h1 className="text-3xl font-semibold">{note.title || 'Untitled'}</h1>
        </div>
        <button type="button" className="rounded-3xl bg-slate-900 px-5 py-3 text-white" onClick={() => router.push('/notes')}>
          Back to notes
        </button>
      </div>
      <Editor note={note} folders={folders} onSave={saveNote} onShare={handleShare} onExport={handleExport} />
      {saving ? <div className="mt-4 text-sm text-slate-500">Saving…</div> : null}
    </div>
  )
}
