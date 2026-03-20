import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Admin user
  const adminHash = await bcrypt.hash('admin123', 12)
  await prisma.user.upsert({
    where: { email: 'admin@physioclinic.co.uk' },
    update: {},
    create: {
      email: 'admin@physioclinic.co.uk',
      passwordHash: adminHash,
      name: 'Admin',
      role: 'admin',
    },
  })

  // Test patient
  const patientHash = await bcrypt.hash('patient123', 12)
  await prisma.user.upsert({
    where: { email: 'patient@example.com' },
    update: {},
    create: {
      email: 'patient@example.com',
      passwordHash: patientHash,
      name: 'Jane Smith',
      phone: '07700900123',
      role: 'patient',
    },
  })

  // Services
  await prisma.service.upsert({
    where: { id: 'sports-massage' },
    update: {},
    create: {
      id: 'sports-massage',
      name: 'Sports Massage',
      durationMinutes: 60,
      pricePence: 7500,
      description:
        'A therapeutic massage targeting muscles used in sport and physical activity. Helps reduce tension, improve mobility, and aid recovery.',
      isActive: true,
    },
  })

  // Weekly schedule: Mon–Fri 9am–5pm, 60-min slots
  const weekdays = [1, 2, 3, 4, 5]
  for (const day of weekdays) {
    const existing = await prisma.weeklySchedule.findFirst({ where: { dayOfWeek: day } })
    if (!existing) {
      await prisma.weeklySchedule.create({
        data: {
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          slotDurationMinutes: 60,
          isActive: true,
        },
      })
    }
  }

  console.log('Seed complete.')
  console.log('  Admin:   admin@physioclinic.co.uk / admin123')
  console.log('  Patient: patient@example.com / patient123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
