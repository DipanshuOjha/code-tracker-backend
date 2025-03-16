import mongoose from 'mongoose';

const contestSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  phase: { type: String, required: true },
  frozen: { type: Boolean, default: false },
  durationSeconds: { type: Number, required: true },
  startTimeSeconds: { type: Number, required: true },
  relativeTimeSeconds: { type: Number },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('Contest', contestSchema); 