import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongoose'
import { getSession } from '../../../../lib/session'
import Note from '../../../../models/Note'

export async function GET(req, { params }) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const note = await Note.findOne({ _id: params.id, userId: session.user.id })
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }
  return NextResponse.json(note)
}

export async function PUT(req, { params }) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await dbConnect()
  const note = await Note.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    {
      title: body.title || 'Untitled',
      content: body.content || '',
      tags: body.tags || [],
      color: body.color || '#ffffff',
      folderId: body.folderId || null,
    },
    { new: true }
  )

  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }
  return NextResponse.json(note)
}

export async function DELETE(req, { params }) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const note = await Note.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    { isTrashed: true },
    { new: true }
  )

  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
