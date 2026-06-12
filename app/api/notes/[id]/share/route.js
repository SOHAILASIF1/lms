import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { nanoid } from 'nanoid'
import dbConnect from '../../../../../lib/mongoose'
import { authOptions } from '../../../../../lib/auth'
import Note from '../../../../../models/Note'

async function getSession(req) {
  return getServerSession({ req }, authOptions)
}

export async function PATCH(req, { params }) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const note = await Note.findOne({ _id: params.id, userId: session.user.id })
  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })

  if (!note.publicSlug) {
    note.publicSlug = nanoid(12)
  }
  note.isPublic = true
  await note.save()
  return NextResponse.json(note)
}
