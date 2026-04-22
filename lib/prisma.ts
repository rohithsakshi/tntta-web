import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not set. Prisma will not be initialized.")
    return null as any
  }
  
  try {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ 
      // @ts-ignore - Prisma 7 specific initialization
      adapter 
    })
  } catch (error) {
    console.error("Failed to initialize Prisma:", error)
    return null as any
  }
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
