const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  console.log('Testing connection...');
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('Connection successful:', result);
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    const users = await prisma.user.findMany({ select: { email: true } });
    console.log('Users:', users);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
