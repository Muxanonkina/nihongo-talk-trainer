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

export const createUserProgress = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id;
        const { dialogId, score, feedback, messages } = req.body;

        if (!dialogId) {
            return res.status(400).json({ message: 'Dialog ID is required' });
        }

        console.log('Creating UserProgress with:', { userId, dialogId, score, feedback, messagesLength: messages?.length });
        console.log('DEBUG: req.user:', req.user); // Verify user is authenticated


        const newUserProgress = await userProgressService.create({
            userId,
            dialogId,
            score: Number(score), // Ensure score is a number
            feedback,
            messages
        });

        res.status(201).json(newUserProgress);
    } catch (error) {
        console.error('Create User Progress Error:', error);
        res.status(500).json({ message: 'Failed to create user progress.', error: String(error) });
    }

};
