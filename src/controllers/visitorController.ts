import { Request, Response } from 'express';
import Visitor from '../models/Visitor';

export const logVisit = async (req: Request, res: Response) => {
  try {
    console.log('Attempting to log visit with data:', {
      ip: req.ip || req.socket.remoteAddress,
      action: req.body.action,
      handles: req.body.handles,
      path: req.body.path
    });

    const visitorLog = await Visitor.create({
      ipAddress: req.ip || req.socket.remoteAddress,
      action: req.body.action,
      handles: req.body.handles,
      path: req.body.path,
      userAgent: req.headers['user-agent']
    });

    console.log('Successfully logged visit:', visitorLog);
    res.status(201).json(visitorLog);
  } catch (error: any) {
    console.error('Error logging visit:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ error: error.message || 'Failed to log visitor' });
  }
};

export const getVisitorStats = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalVisits,
      dailyVisits,
      weeklyVisits,
      monthlyVisits,
      uniqueVisitors,
      topSearchedHandles,
      topComparedHandles
    ] = await Promise.all([
      Visitor.countDocuments(),
      Visitor.countDocuments({ timestamp: { $gte: dayAgo } }),
      Visitor.countDocuments({ timestamp: { $gte: weekAgo } }),
      Visitor.countDocuments({ timestamp: { $gte: monthAgo } }),
      Visitor.distinct('ipAddress').exec(),
      Visitor.aggregate([
        { $match: { action: 'SEARCH' } },
        { $unwind: '$handles' },
        { $group: { _id: '$handles', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Visitor.aggregate([
        { $match: { action: 'COMPARE' } },
        { $unwind: '$handles' },
        { $group: { _id: '$handles', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ])
    ]);

    res.json({
      totalVisits,
      dailyVisits,
      weeklyVisits,
      monthlyVisits,
      uniqueVisitors: uniqueVisitors.length,
      topSearchedHandles,
      topComparedHandles
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to get visitor stats' });
  }
}; 