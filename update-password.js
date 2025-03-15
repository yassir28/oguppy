const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Replace with the actual user ID from your logs
  const userId = 'cm8aecpgy0000g0ygbxdnuwci';
  
  // Choose a new password
  const newPassword = '123456789';  // Or whatever password you want to use
  
  // Hash the password with bcrypt
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update the user record
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
  
  console.log('Password updated for user:', updatedUser.email);
  console.log('New bcrypt hash:', hashedPassword);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

