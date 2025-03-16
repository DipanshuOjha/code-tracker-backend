import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true },
  rating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  rank: { type: String, default: 'unrated' },
  maxRank: { type: String, default: 'unrated' },
  contribution: { type: Number, default: 0 },
  friendOfCount: { type: Number, default: 0 },
  lastOnlineTimeSeconds: { type: Number },
  registrationTimeSeconds: { type: Number },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema); 