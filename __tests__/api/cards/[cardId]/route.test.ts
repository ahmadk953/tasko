import { GET } from '@/app/api/cards/[cardId]/route';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { createParams, expectWithSerializedDates } from '@/lib/test-utils';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    card: {
      findUnique: jest.fn(),
    },
  },
}));

describe('/api/cards/[cardId] GET', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>;
  const mockFindUnique = db.card.findUnique as jest.MockedFunction<
    typeof db.card.findUnique
  >;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 when user is not authenticated', async () => {
    mockAuth.mockResolvedValue({
      userId: null,
      orgId: null,
    } as any);

    const req = new Request('http://localhost:3000/api/cards/card-id');
    const response = await GET(req, {
      params: Promise.resolve({ cardId: 'card-id' }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('should return 401 when orgId is missing', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: null,
    } as any);

    const req = new Request('http://localhost:3000/api/cards/card-id');
    const response = await GET(req, {
      params: Promise.resolve({ cardId: 'card-id' }),
    });

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('should return card data when authenticated', async () => {
    const mockCard = {
      id: 'card-123',
      title: 'Test Card',
      order: 1,
      description: 'Test description',
      dueDate: null,
      startedAt: null,
      listId: 'list-123',
      createdAt: new Date('2025-11-06T23:57:16.801Z'),
      updatedAt: new Date('2025-11-06T23:57:16.801Z'),
      list: {
        title: 'Test List',
      },
    };

    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    mockFindUnique.mockResolvedValue(mockCard as any);

    const req = new Request('http://localhost:3000/api/cards/card-123');
    const response = await GET(req, {
      params: createParams({ cardId: 'card-123' }),
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    // Use utility to compare with serialized dates
    expectWithSerializedDates(data, mockCard);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: {
        id: 'card-123',
        list: {
          board: {
            orgId: 'org-123',
          },
        },
      },
      include: {
        list: {
          select: {
            title: true,
          },
        },
      },
    });
  });

  it('should return 500 when database throws an error', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    const error = new Error('Database error');
    mockFindUnique.mockRejectedValue(error);

    const req = new Request('http://localhost:3000/api/cards/card-123');
    const response = await GET(req, {
      params: createParams({ cardId: 'card-123' }),
    });

    expect(response.status).toBe(500);
  });
});
