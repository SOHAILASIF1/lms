'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const filters = [
  { label: 'All', value: '' },
  { label: 'Pinned', value: 'pinned' },
  { label: 'Starred', value: 'starred' },
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
]

export default function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [activeFilter, setActiveFilter] = useState(params.get('filter') || '')

  useEffect(() => {
    setQuery(params.get('q') || '')
    setActiveFilter(params.get('filter') || '')
  }, [params])

  const handleSearch = (event) => {
    event.preventDefault()
    router.push(`/notes?q=${encodeURIComponent(query)}${activeFilter ? `&filter=${activeFilter}` : ''}`)
  }

  const changeFilter = (value) => {
    setActiveFilter(value)
    router.push(`/notes?filter=${encodeURIComponent(value)}${query ? `&q=${encodeURIComponent(query)}` : ''}`)
  }

  if (!pathname.startsWith('/notes') && !pathname.startsWith('/starred') && !pathname.startsWith('/trash') && !pathname.startsWith('/folders')) {
    return null
  }

  return (
    <div className="mb-8 rounded-3xl bg-white p-5 shadow-sm">
      <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes"
          className="flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
        />
        <button type="submit" className="rounded-3xl bg-slate-900 px-5 py-3 text-white">
          Search
        </button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button key={filter.value} type="button" className={`rounded-full px-4 py-2 text-sm ${activeFilter === filter.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`} onClick={() => changeFilter(filter.value)}>
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  )
}
