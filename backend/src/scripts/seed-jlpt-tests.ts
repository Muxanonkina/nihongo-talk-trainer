import prisma from '../config/db';
import * as fs from 'fs';
import * as path from 'path';

async function seedJLPTTests() {
    console.log('Seeding JLPT tests...');

    const testsDir = path.join(__dirname, '../data/jlpt-tests');

    // Check if directory exists
    if (!fs.existsSync(testsDir)) {
        console.log('No JLPT tests directory found. Skipping...');
        return;
    }

    // Read all JSON files in the directory
    const files = fs.readdirSync(testsDir).filter((file) => file.endsWith('.json'));

    for (const file of files) {
        const filePath = path.join(testsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Check if test already exists
        const existing = await prisma.jLPTTest.findUnique({
            where: { testId: data.testId },
        });

        if (existing) {
            console.log(`Test ${data.testId} already exists. Skipping...`);
            continue;
        }

        // Create test in database
        await prisma.jLPTTest.create({
            data: {
                testId: data.testId,
                title: data.title,
                level: data.level,
                category: data.category,
                sections: JSON.stringify(data.sections),
            },
        });

        console.log(`Created test: ${data.testId}`);
    }

    console.log('JLPT tests seeding completed!');
}

seedJLPTTests()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
