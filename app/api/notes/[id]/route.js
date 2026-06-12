import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '../../../../lib/mongoose'
import { authOptions } from '../../../../lib/auth'
import Note from '../../../../models/Note'

async function getSession(req) {
  return getServerSession({ req }, authOptions)
}

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
