
import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up duplicate templates...');

    // Get all templates
    const templates = await prisma.contractTemplate.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const uniqueNames = new Set();
    const toDelete = [];

    for (const t of templates) {
        if (uniqueNames.has(t.name)) {
            toDelete.push(t.id);
        } else {
            uniqueNames.add(t.name);
        }
    }

    if (toDelete.length > 0) {
        console.log(`Found ${toDelete.length} duplicates. Deleting...`);
        await prisma.contractTemplate.deleteMany({
            where: {
                id: { in: toDelete }
            }
        });
        console.log('Duplicates deleted.');
    } else {
        console.log('No duplicates found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
