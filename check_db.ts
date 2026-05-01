import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  console.log("Users in DB:", users.length)
  const admin = await prisma.user.findUnique({ where: { contact: '9999999999' } })
  console.log("Admin user:", admin)
}

main().catch(console.error).finally(() => prisma.$disconnect())
