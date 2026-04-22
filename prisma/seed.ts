import { PrismaClient, UserRole, Gender, Category, TournamentStatus, PaymentStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
// @ts-ignore
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Admin User
  const adminPassword = await bcrypt.hash('Admin@123', 10)
  const admin = await prisma.user.upsert({
    where: { contact: '9999999999' },
    update: {},
    create: {
      tnttaId: 'TNTTA-2025-ADMIN',
      firstName: 'TNTTA',
      lastName: 'Admin',
      contact: '9999999999',
      passwordHash: adminPassword,
      gender: 'MALE',
      dob: new Date('1980-01-01'),
      district: 'Chennai',
      category: 'SENIOR',
      role: 'ADMIN',
    },
  })

  // 2. Sample Players
  const playerPasswords = await bcrypt.hash('Player@123', 10)
  const players = []
  for (let i = 1; i <= 5; i++) {
    const p = await prisma.user.upsert({
      where: { contact: `987654321${i}` },
      update: {},
      create: {
        tnttaId: `TNTTA-2025-000${i}`,
        firstName: `Player`,
        lastName: `${i}`,
        contact: `987654321${i}`,
        passwordHash: playerPasswords,
        gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
        dob: new Date(2000 + i, 0, 1),
        district: i % 2 === 0 ? 'Coimbatore' : 'Madurai',
        category: 'SENIOR',
        role: 'PLAYER',
        rankingPoints: 100 + i * 10,
      },
    })
    players.push(p)
  }

  // 3. Sample Tournaments
  const tournament1 = await prisma.tournament.upsert({
    where: { slug: '7th-tntta-state-ranking-tt-tournament-2025' },
    update: {},
    create: {
      title: '7th TNTTA State Ranking TT Tournament 2025',
      slug: '7th-tntta-state-ranking-tt-tournament-2025',
      description: 'The 7th State Ranking Tournament for the year 2025.',
      location: 'Chennai',
      venue: 'SK Academy, Chennai',
      startDate: new Date('2026-02-25'),
      endDate: new Date('2026-02-28'),
      registrationOpens: new Date('2026-02-01'),
      registrationDeadline: new Date('2026-02-20'),
      entryFee: 50000,
      type: 'STATE_RANKING' as any,
      categories: [Category.MINI_CADET, Category.CADET, Category.SUB_JUNIOR, Category.JUNIOR, Category.SENIOR, Category.MENS, Category.VETERANS] as any,
      status: TournamentStatus.OPEN,
      createdById: admin.id,
    } as any,
  })

  const tournament2 = await prisma.tournament.upsert({
    where: { slug: 'tn-state-championship-2025' },
    update: {},
    create: {
      title: 'TN State Championship 2025',
      slug: 'tn-state-championship-2025',
      description: 'Annual State Championship.',
      location: 'Madurai',
      venue: 'Madurai District Stadium',
      startDate: new Date('2026-03-15'),
      endDate: new Date('2026-03-20'),
      registrationOpens: new Date('2026-03-01'),
      registrationDeadline: new Date('2026-03-10'),
      entryFee: 100000,
      type: 'STATE_CHAMPIONSHIP' as any,
      categories: [Category.JUNIOR, Category.SENIOR, Category.MENS] as any,
      status: TournamentStatus.UPCOMING,
      createdById: admin.id,
    } as any,
  })

  const tournament3 = await prisma.tournament.upsert({
    where: { slug: 'coimbatore-district-open-2025' },
    update: {},
    create: {
      title: 'Coimbatore District Open 2025',
      slug: 'coimbatore-district-open-2025',
      description: 'Open tournament for Coimbatore district.',
      location: 'Coimbatore',
      venue: 'Coimbatore TT Hall',
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-01-12'),
      registrationOpens: new Date('2026-01-01'),
      registrationDeadline: new Date('2026-01-05'),
      entryFee: 30000,
      type: 'OPEN_TOURNAMENT' as any,
      categories: [Category.CADET, Category.SUB_JUNIOR] as any,
      status: TournamentStatus.COMPLETED,
      createdById: admin.id,
    } as any,
  })

  // 4. News Items
  await prisma.newsItem.createMany({
    data: [
      {
        title: 'New State Ranking Tournament Announced',
        excerpt: 'The 7th State Ranking tournament will be held in Chennai.',
        content: 'Full details of the 7th State Ranking tournament are now available...',
        authorId: admin.id,
        isPublished: true,
      },
      {
        title: 'Ranking Points Update',
        excerpt: 'Latest ranking points after the Coimbatore Open.',
        content: 'Check the updated ranking points for all categories...',
        authorId: admin.id,
        isPublished: true,
      },
      {
        title: 'TNTTA Annual General Meeting',
        excerpt: 'The AGM for the year 2025 will be held next month.',
        content: 'The TNTTA Annual General Meeting will discuss the upcoming season...',
        authorId: admin.id,
        isPublished: false,
      },
    ],
  })

  // 5. Match Results
  await prisma.matchResult.create({
    data: {
      tournamentId: tournament3.id,
      player1Id: players[0].id,
      player2Id: players[1].id,
      score: '11-8, 9-11, 11-6, 11-7',
      winnerId: players[0].id,
      round: 'Final',
      category: 'SENIOR',
    },
  })

  await prisma.matchResult.create({
    data: {
      tournamentId: tournament3.id,
      player1Id: players[2].id,
      player2Id: players[3].id,
      score: '11-5, 11-9, 11-8',
      winnerId: players[2].id,
      round: 'Semifinal',
      category: 'SENIOR',
    },
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
