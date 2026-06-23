import mongoose, { Schema } from 'mongoose'

const CheckinSchema = new Schema({
  id: { type: String, index: true, unique: true },
  userId: { type: String, index: true },
  weekOf: Date,
  progressNotes: String,
  tasksJson: Schema.Types.Mixed,
  accountabilityScore: Number,
  vznVoice: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Checkin || mongoose.model('Checkin', CheckinSchema)
