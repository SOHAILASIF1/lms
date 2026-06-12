import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/mongoose'
import Note from '../../../../models/Note'

export async function GET(req, { params }) {
  await dbConnect()
  const note = await Note.findOne({ publicSlug: params.slug, isPublic: true })
  if (!note) {
    return NextResponse.json({ error: 'Note not found' }, { status: 404 })
  }
  return NextResponse.json(note)
}
