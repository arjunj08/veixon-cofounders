import mongoose, { Schema } from 'mongoose'

const GeneratedProductSchema = new Schema(
  {
    startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true, unique: true },
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true },
    repositoryUrl: String,
    deploymentUrl: String,
    techStack: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

export default mongoose.models.GeneratedProduct || mongoose.model('GeneratedProduct', GeneratedProductSchema)
