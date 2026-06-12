'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const navItems = [
  { href: '/notes', label: 'All Notes' },
  { href: '/starred', label: 'Starred' },
  { href: '/trash', label: 'Trash' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [folders, setFolders] = useState([])
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/folders')
      if (res.ok) {
        const data = await res.json()
        setFolders(data)
      }
    }
    load()
  }, [])

  const createFolder = async () => {
    const name = prompt('Folder name')
    if (!name) return
    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    if (res.ok) {
      const folder = await res.json()
      setFolders((current) => [folder, ...current])
    }
  }

  const sidebarContent = (
    <div className="h-full w-full max-w-xs border-r border-slate-200 bg-white p-4">
      <div className="mb-6 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <h2 className="text-xl font-semibold text-slate-900">Notes</h2>
        </div>
        <button type="button" className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700" onClick={createFolder}>
          +
        </button>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`block rounded-2xl px-3 py-3 text-sm ${pathname === item.href ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">
        <h3 className="mb-2 text-xs uppercase tracking-[0.2em] text-slate-500">Folders</h3>
        <div className="space-y-2">
          {folders.map((folder) => (
            <Link key={folder._id} href={`/folders/${folder._id}`} className={`block rounded-2xl px-3 py-3 text-sm ${pathname === `/folders/${folder._id}` ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: folder.color }}></span> {folder.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto pt-6">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
            {session?.user?.image ? <img src={session.user.image} alt="avatar" className="h-full w-full object-cover" /> : <span className="flex h-full w-full items-center justify-center text-slate-500">{session?.user?.name?.slice(0, 1) || 'U'}</span>}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{session?.user?.name || 'Guest'}</p>
            <button type="button" className="text-xs text-slate-600" onClick={() => signOut({ callbackUrl: '/login' })}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="md:hidden">
        <button type="button" className="m-4 rounded-2xl bg-white px-4 py-2 shadow-sm" onClick={() => setMobileOpen(true)}>
          Menu
        </button>
      </div>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-900/40 md:hidden">
          <div className="h-full w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <span className="text-lg font-semibold">Menu</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="text-slate-600">✕</button>
            </div>
            <div className="h-[calc(100%-64px)] overflow-y-auto">{sidebarContent}</div>
          </div>
        </div>
      ) : null}
      <div className="hidden md:block">{sidebarContent}</div>
    </>
  )
}
