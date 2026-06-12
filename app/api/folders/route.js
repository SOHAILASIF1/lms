import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '../../../lib/mongoose'
import { authOptions } from '../../../lib/auth'
import Folder from '../../../models/Folder'

async function getSession(req) {
  return getServerSession({ req }, authOptions)
}

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
