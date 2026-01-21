import prisma from '@/config/db';
import * as fs from 'fs';
import * as path from 'path';

interface Question {
    id: string;
    text: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    explanation: string;
}

interface Section {
    sectionName: string;
    instruction: string;
    questions: Question[];
}

interface JLPTTestData {
    testId: string;
    title: string;
    level: string;
    category: string;
    sections: Section[];
}

interface Answer {
    questionId: string;
    selectedOption: string;
}

interface SubmitExamData {
    testId: string;
    answers: Answer[];
}

export class JLPTService {
    private testsDataPath = path.join(__dirname, '../../data/jlpt-tests');

    /**
     * Load test data from JSON file
     */
    private loadTestData(testId: string): JLPTTestData | null {
        try {
            const filePath = path.join(this.testsDataPath, `${testId}.json`);
            if (!fs.existsSync(filePath)) {
                return null;
            }
            const data = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error loading test data:', error);
            return null;
        }
    }

    /**
     * Get all available tests from database
     */
    async getAllTests(level?: string, category?: string) {
        const where: any = {};
        if (level) where.level = level;
        if (category) where.category = category;

        return await prisma.jLPTTest.findMany({
            where,
            select: {
                id: true,
                testId: true,
                title: true,
                level: true,
                category: true,
                createdAt: true,
            },
        });
    }

    /**
     * Get test by ID with questions (without correct answers)
     */
    async getTestById(testId: string) {
        // First try to get from database
        const dbTest = await prisma.jLPTTest.findUnique({
            where: { testId },
        });

        if (dbTest) {
            // Remove correct answers from sections
            const sections = (dbTest.sections as any[]).map((section: Section) => ({
                ...section,
                questions: section.questions.map((q) => {
                    const { correctAnswer, explanation, ...questionWithoutAnswer } = q;
                    return questionWithoutAnswer;
                }),
            }));

            return {
                testId: dbTest.testId,
                title: dbTest.title,
                level: dbTest.level,
                category: dbTest.category,
                sections,
            };
        }

        // Fallback to JSON file
        const testData = this.loadTestData(testId);
        if (!testData) {
            throw new Error('Test not found');
        }

        // Remove correct answers
        const sections = testData.sections.map((section) => ({
            ...section,
            questions: section.questions.map((q) => {
                const { correctAnswer, explanation, ...questionWithoutAnswer } = q;
                return questionWithoutAnswer;
            }),
        }));

        return {
            testId: testData.testId,
            title: testData.title,
            level: testData.level,
            category: testData.category,
            sections,
        };
    }

    /**
     * Validate answers and calculate score
     */
    async submitExam(userId: string, data: SubmitExamData) {
        const { testId, answers } = data;

        // Load test data with correct answers
        let testData: JLPTTestData | null = null;

        // Try database first
        const dbTest = await prisma.jLPTTest.findUnique({
            where: { testId },
        });

        if (dbTest) {
            testData = {
                testId: dbTest.testId,
                title: dbTest.title,
                level: dbTest.level,
                category: dbTest.category,
                sections: dbTest.sections as Section[],
            };
        } else {
            // Fallback to JSON
            testData = this.loadTestData(testId);
        }

        if (!testData) {
            throw new Error('Test not found');
        }

        // Create a map of correct answers
        const correctAnswersMap = new Map<string, string>();
        testData.sections.forEach((section) => {
            section.questions.forEach((q) => {
                correctAnswersMap.set(q.id, q.correctAnswer);
            });
        });

        // Validate and score answers
        const results = answers.map((answer) => {
            const correctAnswer = correctAnswersMap.get(answer.questionId);
            const isCorrect = correctAnswer === answer.selectedOption;

            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                correctAnswer,
                isCorrect,
            };
        });

        const correctAnswers = results.filter((r) => r.isCorrect).length;
        const totalQuestions = answers.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);

        // Save result to database
        const result = await prisma.jLPTResult.create({
            data: {
                userId,
                testId,
                level: testData.level,
                category: testData.category,
                score,
                totalQuestions,
                correctAnswers,
                answers: results,
            },
        });

        return {
            id: result.id,
            score,
            totalQuestions,
            correctAnswers,
            results,
        };
    }

    /**
     * Get category statistics for a user
     */
    async getCategoryStatistics(userId: string) {
        const results = await prisma.jLPTResult.findMany({
            where: { userId },
            select: {
                category: true,
                score: true,
                level: true,
            },
        });

        // Group by category
        const statsMap = new Map<
            string,
            { totalTests: number; totalScore: number; level: string }
        >();

        results.forEach((result) => {
            const key = `${result.level}_${result.category}`;
            if (!statsMap.has(key)) {
                statsMap.set(key, {
                    totalTests: 0,
                    totalScore: 0,
                    level: result.level,
                });
            }

            const stats = statsMap.get(key)!;
            stats.totalTests += 1;
            stats.totalScore += result.score;
        });

        // Convert to array with average scores
        const statistics = Array.from(statsMap.entries()).map(([key, stats]) => {
            const [level, category] = key.split('_');
            return {
                level,
                category,
                totalTests: stats.totalTests,
                averageScore: Math.round(stats.totalScore / stats.totalTests),
            };
        });

        return statistics;
    }

    /**
     * Get user's test history
     */
    async getUserHistory(userId: string, limit: number = 10) {
        return await prisma.jLPTResult.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            select: {
                id: true,
                testId: true,
                level: true,
                category: true,
                score: true,
                totalQuestions: true,
                correctAnswers: true,
                createdAt: true,
            },
        });
    }
}
