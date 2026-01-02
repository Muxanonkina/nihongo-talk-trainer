import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const scenarios = [
        {
            title: 'At the Convenience Store',
            category: 'Shopping',
            difficulty: 'N5',
            script: [
                { sender: 'bot', text: 'いらっしゃいませ！', translation: 'Welcome!' },
                { sender: 'user', text: 'すみません、これいくらですか？', translation: 'Excuse me, how much is this?' },
                { sender: 'bot', text: 'それは百円です。', translation: 'That is 100 yen.' },
                { sender: 'user', text: 'じゃ、これください。', translation: 'Okay, I will take this.' },
                { sender: 'bot', text: 'まだ何が注文したいですか？', translation: 'Would you like to order anything else?' },
            ],
        },
        {
            title: 'Ordering at a Restaurant',
            category: 'Restaurant',
            difficulty: 'N4',
            script: [
                { sender: 'bot', text: 'いらっしゃいませ。何名様ですか？', translation: 'Welcome. How many people?' },
                { sender: 'user', text: '二人です。', translation: 'Two people.' },
                { sender: 'bot', text: 'こちらの席へどうぞ。', translation: 'Please come to this seat.' },
                { sender: 'user', text: 'メニューを見せてください。', translation: 'Please show me the menu.' },
                { sender: 'bot', text: 'はい、どうぞ。', translation: 'Here you go.' },
            ],
        },
        {
            title: 'Self Introduction',
            category: 'Social',
            difficulty: 'N5',
            script: [
                { sender: 'bot', text: '初めまして。私の名前は田中です。', translation: 'Nice to meet you. My name is Tanaka.' },
                { sender: 'user', text: '初めまして。私はジョンです。', translation: 'Nice to meet you. I am John.' },
                { sender: 'bot', text: '出身はどこですか？', translation: 'Where are you from?' },
                { sender: 'user', text: 'アメリカです。', translation: 'I am from America.' },
                { sender: 'bot', text: 'よろしくお願いします。', translation: 'Nice to meet you.' },
            ],
        },
    ];

    console.log('Start seeding...');

    for (const scenario of scenarios) {
        // We use create because we don't have stable IDs yet. in a real app we might upsert by unique slug/title
        // But here we want to ensure we don't duplicate if run multiple times, so let's try to find first
        const existing = await prisma.dialog.findFirst({
            where: { title: scenario.title }
        });

        if (!existing) {
            const dialog = await prisma.dialog.create({
                data: scenario,
            });
            console.log(`Created dialog with id: ${dialog.id}`);
        } else {
            console.log(`Dialog "${scenario.title}" already exists.`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
