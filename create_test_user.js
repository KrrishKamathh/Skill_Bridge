const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createTestUser() {
  const email = 'test@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { password: hashedPassword },
      create: {
        email,
        password: hashedPassword,
        name: 'Test User',
        role: 'STUDENT',
      },
    });
    console.log('Test user ready:', user.email);
  } catch (error) {
    console.error('Failed to create test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
