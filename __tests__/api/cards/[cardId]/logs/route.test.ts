import { GET } from '@/app/api/cards/[cardId]/logs/route';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { ENTITY_TYPE } from '@prisma/client';
import { createParams, expectWithSerializedDates } from '@/__tests__/test-utils';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    auditLog: {
      findMany: jest.fn(),
    },
  },
}));

describe('/api/cards/[cardId]/logs GET', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>;
  const mockFindMany = db.auditLog.findMany as jest.MockedFunction<
    typeof db.auditLog.findMany
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when user is not authenticated', async () => {
    mockAuth.mockResolvedValue({
      userId: null,
      orgId: null,
    } as any);

    const req = new Request('http://localhost:3000/api/cards/card-id/logs');
    const response = await GET(req, { params: createParams({ cardId: 'card-id' }) });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('should return 401 when orgId is missing', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: null,
    } as any);

    const req = new Request('http://localhost:3000/api/cards/card-id/logs');
    const response = await GET(req, { params: createParams({ cardId: 'card-id' }) });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('should return audit logs when authenticated', async () => {
    const mockLogs = [
      {
        id: 'log-1',
        orgId: 'org-123',
        action: 'CREATE',
        entityId: 'card-123',
        entityType: ENTITY_TYPE.CARD,
        entityTitle: 'Test Card',
        userId: 'user-123',
        userImage: 'https://example.com/image.jpg',
        userName: 'Test User',
        createdAt: new Date('2025-11-06T23:59:36.126Z'),
        updatedAt: new Date('2025-11-06T23:59:36.126Z'),
      },
      {
        id: 'log-2',
        orgId: 'org-123',
        action: 'UPDATE',
        entityId: 'card-123',
        entityType: ENTITY_TYPE.CARD,
        entityTitle: 'Test Card Updated',
        userId: 'user-123',
        userImage: 'https://example.com/image.jpg',
        userName: 'Test User',
        createdAt: new Date('2025-11-06T23:59:36.126Z'),
        updatedAt: new Date('2025-11-06T23:59:36.126Z'),
      },
    ];

    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    mockFindMany.mockResolvedValue(mockLogs as any);

    const req = new Request('http://localhost:3000/api/cards/card-123/logs');
    const response = await GET(req, { params: createParams({ cardId: 'card-123' }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    // Use utility to compare with serialized dates
    expectWithSerializedDates(data, mockLogs);
    expect(mockFindMany).toHaveBeenCalledWith({
      where: {
        orgId: 'org-123',
        entityId: 'card-123',
        entityType: ENTITY_TYPE.CARD,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 3,
    });
  });

  it('should return empty array when no logs exist', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    mockFindMany.mockResolvedValue([]);

    const req = new Request('http://localhost:3000/api/cards/card-123/logs');
    const response = await GET(req, { params: createParams({ cardId: 'card-123' }) });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([]);
  });

  it('should return 500 when database throws an error', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    const error = new Error('Database error');
    mockFindMany.mockRejectedValue(error);

    const req = new Request('http://localhost:3000/api/cards/card-123/logs');
    const response = await GET(req, { params: createParams({ cardId: 'card-123' }) });

    expect(response.status).toBe(500);
  });
});
