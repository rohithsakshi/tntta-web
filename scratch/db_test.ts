import prisma from '../lib/prisma'

async function main() {
  console.log('Testing DB connection with singleton...')
  if (!prisma) {
    console.error('Prisma singleton is NULL (missing DATABASE_URL)')
    return
  }

  try {
    const userCount = await prisma.user.count()
    console.log('Connection successful! User count:', userCount)
    
    const tournaments = await prisma.tournament.findMany()
    console.log('Tournaments in DB:', tournaments.length)
    console.log(JSON.stringify(tournaments, null, 2))
    
  } catch (err) {
    console.error('DB Connection Failed:', err)
  }
}

main()
