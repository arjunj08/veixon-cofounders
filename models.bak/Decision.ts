import mongoose, { Schema } from 'mongoose'

const DecisionSchema = new Schema({
  id: { type: String, index: true, unique: true },
  userId: { type: String, index: true },
  startupId: String,
  description: String,
  decisionType: String,
  scenariosJson: Schema.Types.Mixed,
  recommendation: String,
  reasoning: String,
  vznVoice: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Decision || mongoose.model('Decision', DecisionSchema)
