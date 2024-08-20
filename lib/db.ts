import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { withOptimize } from '@prisma/extension-optimize';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = new PrismaClient()
  .$extends(withAccelerate())
  .$extends(withOptimize());
