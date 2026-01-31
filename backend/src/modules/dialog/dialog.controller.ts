import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllDialogs = async (req: Request, res: Response) => {
    try {
        const dialogs = await prisma.dialog.findMany({
            select: {
                id: true,
                title: true,
                category: true,
                difficulty: true,
                // optimized: don't select script for list view
            }
        });
        res.status(200).json(dialogs);
    } catch (error) {
        console.error('Error fetching dialogs:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getDialogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: 'Dialog ID is required' });
            return;
        }

        const dialog = await prisma.dialog.findUnique({
            where: { id }
        });

        if (!dialog) {
            res.status(404).json({ message: 'Dialog not found' });
            return;
        }

        const parsedDialog = {
            ...dialog,
            script: JSON.parse(dialog.script as unknown as string)
        };

        res.status(200).json(parsedDialog);
    } catch (error) {
        console.error('Error fetching dialog:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
