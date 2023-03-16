import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query', 'info'] })

export { prisma, Prisma }