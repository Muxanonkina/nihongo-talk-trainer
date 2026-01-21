import { Request, Response } from 'express';
import { JLPTService } from './jlpt.service';

const jlptService = new JLPTService();

/**
 * Get list of available tests
 * GET /api/jlpt/tests?level=N2&category=Vocabulary
 */
export const getTests = async (req: Request, res: Response) => {
    try {
        const { level, category } = req.query;

        const tests = await jlptService.getAllTests(
            level as string,
            category as string
        );

        res.status(200).json({ tests });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get questions for a specific test
 * GET /api/jlpt/questions/:testId
 */
export const getQuestions = async (req: Request, res: Response) => {
    try {
        const { testId } = req.params;

        if (!testId) {
            return res.status(400).json({ message: 'Test ID is required' });
        }

        const test = await jlptService.getTestById(testId);

        res.status(200).json(test);
    } catch (error: any) {
        if (error.message === 'Test not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * Submit exam answers and get results
 * POST /api/jlpt/submit
 * Body: { testId: string, answers: [{ questionId: string, selectedOption: string }] }
 */
export const submitExam = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { testId, answers } = req.body;

        // Validation
        if (!testId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({
                message: 'Invalid request. testId and answers array are required',
            });
        }

        if (answers.length === 0) {
            return res.status(400).json({
                message: 'Answers array cannot be empty',
            });
        }

        // Validate answer format
        for (const answer of answers) {
            if (!answer.questionId || !answer.selectedOption) {
                return res.status(400).json({
                    message: 'Each answer must have questionId and selectedOption',
                });
            }
        }

        const result = await jlptService.submitExam(userId, { testId, answers });

        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Test not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get category statistics for the authenticated user
 * GET /api/jlpt/stats
 */
export const getCategoriesStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const stats = await jlptService.getCategoryStatistics(userId);

        res.status(200).json({ stats });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get user's test history
 * GET /api/jlpt/history?limit=10
 */
export const getHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

        const history = await jlptService.getUserHistory(userId, limit);

        res.status(200).json({ history });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
