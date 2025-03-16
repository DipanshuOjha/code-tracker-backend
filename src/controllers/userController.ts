import { Request, Response } from 'express';
import User from '../models/User';
import * as codeforcesService from '../services/codeforcesService';
import Submission from '../models/Submission';
import type { Submission as SubmissionType } from '../types';

export const getUserData = async (req: Request, res: Response) => {
  try {
    const handle = req.params.handle;
    if (!handle) {
      return res.status(400).json({ error: 'User handle is required' });
    }

    // Check if we have cached user data
    let user = await User.findOne({ handle });
    if (!user) {
      try {
        // Fetch from Codeforces API
        const userData = await codeforcesService.getUser(handle);
        user = await User.create(userData);
      } catch (error: any) {
        // Handle Codeforces API errors
        if (error.response?.status === 400) {
          return res.status(404).json({ error: `User '${handle}' not found on Codeforces` });
        }
        throw error;
      }
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch user data' });
  }
};

export const getRatingHistory = async (req: Request, res: Response) => {
  try {
    const handle = req.params.handle;
    if (!handle) {
      return res.status(400).json({ error: 'User handle is required' });
    }

    try {
      // First verify if user exists
      await codeforcesService.getUser(handle);
      // Then fetch rating history
      const ratingHistory = await codeforcesService.getRatingHistory(handle);
      res.json(ratingHistory);
    } catch (error: any) {
      if (error.response?.status === 400) {
        return res.status(404).json({ error: `User '${handle}' not found on Codeforces` });
      }
      throw error;
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch rating history' });
  }
};

export const getMultipleUsers = async (req: Request, res: Response) => {
  try {
    const handles = req.params.handles.split(';');
    if (!handles || handles.length === 0) {
      return res.status(400).json({ error: 'User handles are required' });
    }

    const users = await Promise.all(
      handles.map(async (handle) => {
        try {
          let user = await User.findOne({ handle });
          if (!user) {
            const userData = await codeforcesService.getUser(handle);
            user = await User.create(userData);
          }
          return user;
        } catch (error: any) {
          if (error.response?.status === 400) {
            throw new Error(`User '${handle}' not found on Codeforces`);
          }
          throw error;
        }
      })
    ).catch(error => {
      throw new Error(error.message);
    });

    res.json(users);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const getUserSubmissions = async (req: Request, res: Response) => {
  try {
    const handle = req.params.handle;
    if (!handle) {
      return res.status(400).json({ error: 'User handle is required' });
    }

    try {
      // First verify if user exists
      await codeforcesService.getUser(handle);
      
      // Check if we have cached submissions
      let submissions = await Submission.find({ handle });
      if (!submissions || submissions.length === 0) {
        // Fetch from Codeforces API
        const submissionsData = await codeforcesService.getUserSubmissions(handle);
        // Add handle to each submission
        const submissionsWithHandle = submissionsData.map((sub: SubmissionType) => ({
          ...sub,
          handle
        }));
        submissions = (await Submission.insertMany(submissionsWithHandle)) as any[];
      }

      res.json(submissions);
    } catch (error: any) {
      if (error.response?.status === 400) {
        return res.status(404).json({ error: `User '${handle}' not found on Codeforces` });
      }
      throw error;
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch submissions' });
  }
}; 