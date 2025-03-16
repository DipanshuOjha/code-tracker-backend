import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  action: { type: String, enum: ['SEARCH', 'COMPARE'], required: true },
  handles: [{ type: String }],
  userAgent: String,
  path: String
});

// Add indexes for common queries
visitorSchema.index({ timestamp: -1 });
visitorSchema.index({ action: 1 });
visitorSchema.index({ ipAddress: 1 });

export default mongoose.model('Visitor', visitorSchema); 