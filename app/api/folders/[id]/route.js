import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '../../../../lib/mongoose'
import { authOptions } from '../../../../lib/auth'
import Folder from '../../../../models/Folder'
import Note from '../../../../models/Note'

async function getSession(req) {
  return getServerSession({ req }, authOptions)
}

export async function PUT(req, { params }) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  await dbConnect()
  const folder = await Folder.findOneAndUpdate(
    { _id: params.id, userId: session.user.id },
    { name: body.name || 'Untitled Folder', color: body.color || '#93c5fd' },
    { new: true }
  )
  if (!folder) {
    return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
  }
  return NextResponse.json(folder)
}

export async function DELETE(req, { params }) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const folder = await Folder.findOneAndDelete({ _id: params.id, userId: session.user.id })
  if (!folder) {
    return NextResponse.json({ error: 'Folder not found' }, { status: 404 })
  }
  await Note.updateMany({ folderId: params.id, userId: session.user.id }, { folderId: null })
  return NextResponse.json({ success: true })
}
