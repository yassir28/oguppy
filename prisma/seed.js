// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');

const prisma = new PrismaClient();

async function main() {

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@inventory.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';


  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists'); 
  }
  else {
  // Create admin user
  const hashedPassword = await hash(adminPassword, 10);
  
  const admin = await prisma.user.create({
    data: {
      name: adminName,
      email: adminEmail,
      hashedPassword: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(), // Mark as verified
    }
  });
    console.log('✅ Admin user created successfully!');
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   👤 Name: ${admin.name}`);
    console.log(`   🔑 Password: ${adminPassword}`);
    console.log(`   🛡️  Role: ${admin.role}`);
    console.log('   ⚠️  IMPORTANT: Change this password after first login!\n');

  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });