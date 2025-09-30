// Create a script like scripts/create-test-user.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'admin', // Or whatever role you want
    },
  });
  
  console.log('User created:', user);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());