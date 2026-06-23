import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    email: String,
    name: String,
    image: String,
    googleId: String,
    subscriptionTier: { type: String, default: 'free' },
    stripeCustomerId: String,
    lastActiveDate: Date,
    streakCount: { type: Number, default: 0 },
    accountabilityScore: { type: Number, default: 0 },
    taskCompletionRate: { type: Number, default: 0 },
    vaultUnlocked: { type: Boolean, default: false },
    oath: String,
    oathDate: Date,
    stressTestResponse: String,
    tractionProof: { type: Boolean, default: false },
    burnRate: Number,
    cashInBank: Number,
    monthlyRevenue: Number,
    // FCM push notification fields
    fcmToken: { type: String },
    notificationsEnabled: { type: Boolean, default: false },
    fcmTokenUpdatedAt: { type: Date },
    notificationPreferences: {
      dailyMorning: { type: Boolean, default: true },
      eveningReminder: { type: Boolean, default: true },
      streakAlert: { type: Boolean, default: true },
      mondayMissile: { type: Boolean, default: true },
      weekUnlock: { type: Boolean, default: true },
      vaultUnlock: { type: Boolean, default: true },
      decisionFollowup: { type: Boolean, default: true },
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
)

export default mongoose.models.User || mongoose.model('User', UserSchema)
