import type { AuditLog } from '@/generated/prisma/client';

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch (action) {
    case 'CREATE':
      return `Created ${entityType.toLowerCase()} "${entityTitle}"`;
    case 'UPDATE':
      return `Updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case 'DELETE':
      return `Deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `Unknown action ${entityType.toLowerCase()} "${entityTitle}"`;
  }
};
