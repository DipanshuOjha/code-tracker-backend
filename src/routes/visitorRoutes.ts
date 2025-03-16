import express from 'express';
import { logVisit, getVisitorStats } from '../controllers/visitorController';

const router = express.Router();

router.post('/log', logVisit);
router.get('/stats', getVisitorStats);

export default router; 