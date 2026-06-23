import mongoose, { Schema } from 'mongoose'

const WorkspaceSchema = new Schema(
  {
    startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true, index: true },
    status: { 
      type: String, 
      enum: ['planning', 'building', 'complete', 'failed'], 
      default: 'planning' 
    },
    contextObject: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

export default mongoose.models.Workspace || mongoose.model('Workspace', WorkspaceSchema)
