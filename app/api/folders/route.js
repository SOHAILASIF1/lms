import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/mongoose'
import { getSession } from '../../../lib/session'
import Folder from '../../../models/Folder'

export async function GET(req) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const folders = await Folder.find({ userId: session.user.id }).sort({ createdAt: -1 })
  return NextResponse.json(folders)
}

export async function POST(req) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  if (!body.name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  await dbConnect()
  const folder = await Folder.create({
    userId: session.user.id,
    name: body.name,
    color: body.color || '#93c5fd',
  })

  return NextResponse.json(folder)
}
