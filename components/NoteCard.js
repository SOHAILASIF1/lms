'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function NoteCard({ note, folders, onDelete, onOpen, onMoveToFolder }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const preview = note.content ? note.content.replace(/<[^>]+>/g, ' ').slice(0, 100) : 'No content yet.'
  const folderName = folders?.find((folder) => folder._id === note.folderId)?.name

  return (
    <div className="card relative overflow-hidden border-l-4" style={{ borderColor: note.color }}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{note.title || 'Untitled'}</h3>
            <p className="text-sm text-slate-500">{preview || 'No content yet.'}</p>
          </div>
          <button type="button" className="text-slate-400 hover:text-slate-700" onClick={() => setMenuOpen((open) => !open)}>
            ⋮
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {note.tags?.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        {folderName ? <div className="mt-3 text-xs text-slate-500">Folder: {folderName}</div> : null}
      </div>
      <div className="absolute right-3 top-3 flex gap-2 text-slate-500">
        {note.isPinned ? <span title="Pinned">📌</span> : null}
        {note.isStarred ? <span title="Starred">⭐</span> : null}
      </div>
      {menuOpen ? (
        <div className="absolute right-3 top-10 z-10 w-40 rounded-2xl border bg-white p-2 shadow-xl">
          <button type="button" className="w-full text-left p-2 hover:bg-slate-100" onClick={() => onOpen(note._id)}>
            Edit
          </button>
          <button type="button" className="w-full text-left p-2 hover:bg-slate-100" onClick={() => onDelete(note._id)}>
            Move to Trash
          </button>
          <button type="button" className="w-full text-left p-2 hover:bg-slate-100" onClick={() => onMoveToFolder(note._id)}>
            Move to Folder
          </button>
        </div>
      ) : null}
    </div>
  )
}
