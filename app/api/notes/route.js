import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '../../../lib/mongoose'
import { authOptions } from '../../../lib/auth'
import Note from '../../../models/Note'

async function getSession(req) {
  return getServerSession({ req }, authOptions)
}

export async function GET(req) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const notes = await Note.find({ userId: session.user.id, isTrashed: false }).sort({ isPinned: -1, updatedAt: -1 })
  return NextResponse.json(notes)
}

export async function POST(req) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await dbConnect()
  const note = await Note.create({
    userId: session.user.id,
    title: body.title || 'Untitled',
    content: body.content || '',
    color: body.color || '#ffffff',
    tags: body.tags || [],
    folderId: body.folderId || null,
  })
  return NextResponse.json(note)
}
