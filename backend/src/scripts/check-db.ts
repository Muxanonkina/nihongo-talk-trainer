
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking database connection...');
    try {
        const count = await prisma.dialog.count();
        console.log(`Database connected successfully.`);
        console.log(`Total Dialogs found: ${count}`);

        if (count === 0) {
            console.log('WARNING: The Dialog table is empty.');
        } else {
            const dialogs = await prisma.dialog.findMany({ select: { id: true, title: true } });
            console.log('Dialogs present:', JSON.stringify(dialogs, null, 2));
        }

    } catch (error) {
        console.error('Error connecting to database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
