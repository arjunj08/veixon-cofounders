import mongoose, { Schema } from 'mongoose'

const ArtifactSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    artifactType: { 
      type: String, 
      enum: ['prd', 'schema', 'api', 'ui', 'code', 'roadmap', 'deployment'], 
      required: true 
    },
    content: Schema.Types.Mixed,
    version: { type: Number, default: 1 },
    isApproved: { type: Boolean, default: false },
    humanFeedback: String,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

export default mongoose.models.Artifact || mongoose.model('Artifact', ArtifactSchema)
