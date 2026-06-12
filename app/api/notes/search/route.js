import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '../../../../lib/mongoose'
import { authOptions } from '../../../../lib/auth'
import Note from '../../../../models/Note'

async function getSession(req) {
  return getServerSession({ req }, authOptions)
}

export async function GET(req) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''

  await dbConnect()
  const query = {
    userId: session.user.id,
    isTrashed: false,
  }

  if (q.trim()) {
    return NextResponse.json(
      await Note.find({
        ...query,
        $text: { $search: q },
      }).sort({ score: { $meta: 'textScore' }, updatedAt: -1 })
    )
  }

  const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 })
  return NextResponse.json(notes)
}
