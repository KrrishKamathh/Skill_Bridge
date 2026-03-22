import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all users...');
  
  // Note: Due to cascade delete we added, this will also clean profiles and jobs.
  const deleted = await prisma.user.deleteMany({});
  
  console.log(`Deleted ${deleted.count} users successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
