
import 'dotenv/config';
import { PrismaClient } from '../src/generated/client';

const prisma = new PrismaClient();

async function main() {
    const template = await prisma.contractTemplate.findFirst({
        where: { name: 'สัญญาเช่ามาตรฐาน' }
    });


    if (template) {
        const fs = require('fs');
        fs.writeFileSync('temp_lease.json', JSON.stringify(JSON.parse(template.content as string), null, 2));
        console.log('Written to temp_lease.json');
    } else {
        console.log('Template not found');
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
