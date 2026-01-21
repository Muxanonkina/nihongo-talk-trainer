import { Router } from 'express';
import {
    getTests,
    getQuestions,
    submitExam,
    getCategoriesStats,
    getHistory,
} from './jlpt.controller';
import { authenticate } from '@/middlewares/auth.middleware';

const router = Router();

// Get all available tests (with optional filters)
router.get('/tests', authenticate, getTests);

// Get questions for a specific test
router.get('/questions/:testId', authenticate, getQuestions);

// Submit exam answers
router.post('/submit', authenticate, submitExam);

// Get category statistics
router.get('/stats', authenticate, getCategoriesStats);

// Get user's test history
router.get('/history', authenticate, getHistory);

export default router;
