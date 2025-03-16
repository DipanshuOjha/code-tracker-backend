import express from 'express';
import { getUserData, getMultipleUsers, getUserSubmissions, getRatingHistory } from '../controllers/userController';

const router = express.Router();

// Put the multiple users route first to prevent conflicts
router.get('/multiple/:handles', getMultipleUsers);
router.get('/:handle', getUserData);
router.get('/:handle/rating', getRatingHistory);
router.get('/:handle/submissions', getUserSubmissions);

export default router; 