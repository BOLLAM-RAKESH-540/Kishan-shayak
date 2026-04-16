import { PrismaClient } from '@prisma/client';

// Single shared instance to avoid connection pool exhaustion
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
