import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { getUserProgresses, getUserProgress, createUserProgress } from './userprogress.controller';

const router = Router();

router.get('/', authenticate, getUserProgresses);
router.get('/:id', authenticate, getUserProgress);
router.post('/', authenticate, createUserProgress);

export default router;
