import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import * as userProgressService from './userprogress.service';

export const getUserProgresses = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const userProgresses = await userProgressService.findAllByUserId(userId);
        res.json(userProgresses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user progresses.' });
    }
};

export const getUserProgress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Dialog ID is required' });
        }
        const userProgress = await userProgressService.findById(id, userId);

        if (!userProgress) {
            return res.status(404).json({ message: 'User progress not found.' });
        }

        res.json(userProgress);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user progress.' });
    }
};
