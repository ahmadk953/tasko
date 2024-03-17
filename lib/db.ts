import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = new PrismaClient().$extends(withAccelerate());

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
// globalThis.prisma ??
