import mongoose from 'mongoose'

const FolderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  color: { type: String, default: '#93c5fd' },
  createdAt: { type: Date, default: Date.now },
})

const Folder = mongoose.models.Folder || mongoose.model('Folder', FolderSchema)
export default Folder
