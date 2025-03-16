export interface User {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  contribution: number;
  friendOfCount: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  lastUpdated: Date;
}

export interface Submission {
  id: number;
  handle: string;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds?: number;
  problem: {
    contestId?: number;
    index?: string;
    name?: string;
    type?: string;
    points?: number;
    rating?: number;
    tags: string[];
  };
  author: {
    contestId?: number;
    members: string[];
    participantType?: string;
    ghost?: boolean;
    startTimeSeconds?: number;
  };
  programmingLanguage?: string;
  verdict?: string;
  testset?: string;
  passedTestCount?: number;
  timeConsumedMillis?: number;
  memoryConsumedBytes?: number;
} 