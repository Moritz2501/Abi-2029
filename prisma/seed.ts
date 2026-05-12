import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth-utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Create default admin user
    const adminUser = await prisma.user.upsert({
      where: { username: 'ADUS' },
      update: {},
      create: {
        firstName: 'Admin',
        lastName: 'User',
        username: 'ADUS',
        name: 'Admin User',
        password: await hashPassword('Admin123!'),
        role: 'ADMIN',
        onboardingStatus: 'APPROVED',
      },
    });

    console.log('✅ Admin user created:', adminUser);

    // Create some sample events
    const event1 = await prisma.eventCalendar.create({
      data: {
        title: 'Abitur Kickoff',
        description: 'Offizielle Eröffnung des Abiturjahrgangs',
        date: new Date('2026-06-01'),
        location: 'Aula',
      },
    });

    const event2 = await prisma.eventCalendar.create({
      data: {
        title: 'Abifahrt',
        description: 'Gemeinsame Abifahrt',
        date: new Date('2026-07-15'),
        location: 'Barcelona',
      },
    });

    console.log('✅ Events created:', event1, event2);

    // Create sample page
    const page = await prisma.page.create({
      data: {
        title: 'Willkommen zu ABI 2029',
        slug: 'welcome',
        content: '<h1>Willkommen!</h1><p>Dies ist die offizielle Webseite des Abiturjahrgangs 2029.</p>',
        published: true,
        createdBy: adminUser.id,
      },
    });

    console.log('✅ Welcome page created:', page);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
