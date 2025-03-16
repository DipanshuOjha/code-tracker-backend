import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  contestId: { type: Number, required: true },
  problemsetName: { type: String },
  index: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  points: { type: Number },
  rating: { type: Number },
  tags: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now }
});

// Compound index for unique problems
problemSchema.index({ contestId: 1, index: 1 }, { unique: true });

export default mongoose.model('Problem', problemSchema); 