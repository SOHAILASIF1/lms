'use client'

import { useEffect, useMemo, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Toolbar from './Toolbar'

const presetColors = ['#ffffff', '#fef3c7', '#dbeafe', '#d1fae5', '#fde2e2', '#f5d0fe', '#d8b4fe', '#c7f9cc']

export default function Editor({ note, folders, onSave, onShare, onExport }) {
  const [title, setTitle] = useState(note?.title || 'Untitled')
  const [tags, setTags] = useState(note?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [color, setColor] = useState(note?.color || '#ffffff')
  const [folderId, setFolderId] = useState(note?.folderId || '')
  const [isPinned, setIsPinned] = useState(note?.isPinned || false)
  const [isStarred, setIsStarred] = useState(note?.isStarred || false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write your note here...' }),
    ],
    content: note?.content || '',
  })

  useEffect(() => {
    if (!note) return
    setTitle(note.title || 'Untitled')
    setTags(note.tags || [])
    setColor(note.color || '#ffffff')
    setFolderId(note.folderId || '')
    setIsPinned(note.isPinned || false)
    setIsStarred(note.isStarred || false)
    editor?.commands?.setContent(note.content || '')
  }, [note, editor])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!editor) return
      onSave({
        title,
        content: editor.getHTML(),
        tags,
        color,
        folderId: folderId || null,
        isPinned,
        isStarred,
      })
    }, 1000)
    return () => clearTimeout(timeout)
  }, [title, tags, color, folderId, isPinned, isStarred, editor, onSave])

  const addTag = () => {
    const tag = tagInput.trim()
    if (!tag || tags.includes(tag)) return
    setTags((current) => [...current, tag])
    setTagInput('')
  }

  const removeTag = (tag) => {
    setTags((current) => current.filter((item) => item !== tag))
  }

  const shareLink = note?.publicSlug ? `${window.location.origin}/shared/${note.publicSlug}` : null

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-3xl font-semibold bg-transparent p-0 text-slate-900 focus:ring-0" placeholder="Untitled" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr,_0.9fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <Toolbar editor={editor} />
          <div className="editor-shell min-h-[50vh] rounded-3xl border border-slate-200 p-4">
            <EditorContent editor={editor} />
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-600">Color</label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((item) => (
                    <button key={item} type="button" className={`h-10 w-10 rounded-2xl border ${color === item ? 'border-slate-900' : 'border-slate-200'}`} style={{ backgroundColor: item }} onClick={() => setColor(item)} />
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-600">Folder</label>
                <select value={folderId || ''} onChange={(e) => setFolderId(e.target.value)} className="w-full">
                  <option value="">No folder</option>
                  {folders?.map((folder) => (
                    <option key={folder._id} value={folder._id}>{folder.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-600">Tags</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1" placeholder="Add tag" />
                  <button type="button" className="secondary" onClick={addTag}>Add</button>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                      <button type="button" className="ml-1 text-xs" onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" className={`button ${isPinned ? 'bg-slate-900 text-white' : 'secondary'}`} onClick={() => setIsPinned(!isPinned)}>{isPinned ? 'Unpin' : 'Pin'}</button>
                <button type="button" className={`button ${isStarred ? 'bg-slate-900 text-white' : 'secondary'}`} onClick={() => setIsStarred(!isStarred)}>{isStarred ? 'Unstar' : 'Star'}</button>
              </div>
              <div className="space-y-3">
                <button type="button" className="w-full" onClick={onShare}>Share</button>
                <button type="button" className="w-full secondary" onClick={onExport}>Export PDF</button>
                {shareLink ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    Share link ready
                    <div className="mt-2 break-all text-blue-600">{shareLink}</div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
