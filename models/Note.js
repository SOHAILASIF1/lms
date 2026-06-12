import mongoose from 'mongoose'

const NoteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
    title: { type: String, default: 'Untitled' },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    color: { type: String, default: '#ffffff' },
    isPinned: { type: Boolean, default: false },
    isStarred: { type: Boolean, default: false },
    isTrashed: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    publicSlug: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
)

NoteSchema.index({ title: 'text', content: 'text' })

const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema)
export default Note
