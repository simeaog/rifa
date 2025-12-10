import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminWhatsapp = '939222040709';
  console.log('Seeding admin user with whatsapp', adminWhatsapp);

  await prisma.user.upsert({
    where: { whatsapp: adminWhatsapp },
    update: {
      nome: 'Admin Master',
      role: 'ADMIN',
      approved: true,
    },
    create: {
      nome: 'Admin Master',
      whatsapp: adminWhatsapp,
      role: 'ADMIN',
      approved: true,
    },
  });

  console.log('Seed finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
