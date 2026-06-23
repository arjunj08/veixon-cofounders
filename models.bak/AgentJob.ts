import mongoose, { Schema } from 'mongoose'

const AgentJobSchema = new Schema(
  {
    workspaceId: { type: Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    agentRole: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'running', 'completed', 'failed'], 
      default: 'pending' 
    },
    logs: [{ 
      timestamp: { type: Date, default: Date.now }, 
      message: String, 
      level: { type: String, default: 'info' } 
    }],
    startedAt: Date,
    completedAt: Date,
    error: String,
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
)

export default mongoose.models.AgentJob || mongoose.model('AgentJob', AgentJobSchema)
