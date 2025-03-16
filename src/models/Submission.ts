import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  handle: { type: String, required: true, index: true },
  id: { type: Number, required: true },
  contestId: { type: Number },
  creationTimeSeconds: { type: Number, required: true },
  relativeTimeSeconds: { type: Number },
  problem: {
    contestId: { type: Number },
    index: { type: String },
    name: { type: String },
    type: { type: String },
    points: { type: Number },
    rating: { type: Number },
    tags: [{ type: String }]
  },
  author: {
    contestId: { type: Number },
    members: [{ type: String }],
    participantType: { type: String },
    ghost: { type: Boolean },
    startTimeSeconds: { type: Number }
  },
  programmingLanguage: { type: String },
  verdict: { type: String },
  testset: { type: String },
  passedTestCount: { type: Number },
  timeConsumedMillis: { type: Number },
  memoryConsumedBytes: { type: Number }
}, {
  timestamps: true
});

// Create a compound index on handle and id to ensure uniqueness
submissionSchema.index({ handle: 1, id: 1 }, { unique: true });

const Submission = mongoose.model('Submission', submissionSchema);

export default Submission; 