import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import PDFDocument from 'pdfkit'
import dbConnect from '../../../../../../lib/mongoose'
import { authOptions } from '../../../../../../lib/auth'
import Note from '../../../../../../models/Note'

async function getSession(req) {
  return getServerSession({ req }, authOptions)
}

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function GET(req, { params }) {
  const session = await getSession(req)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await dbConnect()
  const note = await Note.findOne({ _id: params.id, userId: session.user.id })
  if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 })

  const content = stripHtml(note.content || '')
  const buffers = []
  const doc = new PDFDocument({ size: 'A4', margin: 50 })

  doc.on('data', (chunk) => buffers.push(chunk))
  doc.on('end', () => {})

  doc.fontSize(22).fillColor('#0f172a').text(note.title || 'Untitled', {
    underline: true,
  })
  doc.moveDown(1)
  doc.fontSize(12).fillColor('#334155').text(content || 'No content added yet.', {
    lineGap: 4,
  })
  doc.end()

  await new Promise((resolve) => doc.on('finish', resolve))
  const pdf = Buffer.concat(buffers)

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${note.title || 'note'}.pdf"`,
    },
  })
}
