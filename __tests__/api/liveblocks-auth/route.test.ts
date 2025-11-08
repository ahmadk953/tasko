import { POST } from '@/app/api/liveblocks-auth/route';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Liveblocks } from '@liveblocks/node';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

jest.mock('@/lib/db', () => ({
  db: {
    board: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@liveblocks/node', () => ({
  Liveblocks: jest.fn(),
}));

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

describe('/api/liveblocks-auth POST', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>;
  const mockCurrentUser = currentUser as jest.MockedFunction<
    typeof currentUser
  >;
  const mockFindUnique = db.board.findUnique as jest.MockedFunction<
    typeof db.board.findUnique
  >;
  const mockHeaders = require('next/headers').headers as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LIVEBLOCKS_SECRET_KEY = 'test-secret-key';
  });

  afterEach(() => {
    delete process.env.LIVEBLOCKS_SECRET_KEY;
  });

  it('should return 401 when user is not authenticated', async () => {
    mockAuth.mockResolvedValue({
      isAuthenticated: false,
      orgId: null,
    } as any);
    mockCurrentUser.mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Not authorized' });
  });

  it('should return 400 when BoardId header is missing', async () => {
    mockAuth.mockResolvedValue({
      isAuthenticated: true,
      orgId: 'org-123',
    } as any);
    mockCurrentUser.mockResolvedValue({
      id: 'user-123',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.jpg',
    } as any);
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(null),
    });

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: 'BoardId header is required' });
  });

  it('should return 401 when board does not exist', async () => {
    mockAuth.mockResolvedValue({
      isAuthenticated: true,
      orgId: 'org-123',
    } as any);
    mockCurrentUser.mockResolvedValue({
      id: 'user-123',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.jpg',
    } as any);
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('board-123'),
    });
    mockFindUnique.mockResolvedValue(null);

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Not authorized' });
  });

  it('should return 401 when board orgId does not match user orgId', async () => {
    mockAuth.mockResolvedValue({
      isAuthenticated: true,
      orgId: 'org-123',
    } as any);
    mockCurrentUser.mockResolvedValue({
      id: 'user-123',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.jpg',
    } as any);
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('board-123'),
    });
    mockFindUnique.mockResolvedValue({
      id: 'board-123',
      orgId: 'different-org',
    } as any);

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Not authorized' });
  });

  it('should return 500 when LIVEBLOCKS_SECRET_KEY is not configured', async () => {
    delete process.env.LIVEBLOCKS_SECRET_KEY;

    mockAuth.mockResolvedValue({
      isAuthenticated: true,
      orgId: 'org-123',
    } as any);
    mockCurrentUser.mockResolvedValue({
      id: 'user-123',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.jpg',
    } as any);
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('board-123'),
    });
    mockFindUnique.mockResolvedValue({
      id: 'board-123',
      orgId: 'org-123',
    } as any);

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'LIVEBLOCKS_SECRET_KEY is not configured' });
  });

  it('should return authorization token when request is valid', async () => {
    const mockSession = {
      allow: jest.fn(),
      FULL_ACCESS: 'full-access',
      authorize: jest.fn().mockResolvedValue({
        body: 'auth-token-body',
        status: 200,
      }),
    };

    const mockLiveblocks = {
      prepareSession: jest.fn().mockReturnValue(mockSession),
    };

    (Liveblocks as jest.Mock).mockImplementation(() => mockLiveblocks);

    mockAuth.mockResolvedValue({
      isAuthenticated: true,
      orgId: 'org-123',
    } as any);
    mockCurrentUser.mockResolvedValue({
      id: 'user-123',
      fullName: 'Test User',
      firstName: 'Test',
      imageUrl: 'https://example.com/avatar.jpg',
    } as any);
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('board-123'),
    });
    mockFindUnique.mockResolvedValue({
      id: 'board-123',
      orgId: 'org-123',
    } as any);

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(mockLiveblocks.prepareSession).toHaveBeenCalledWith('user-123', {
      userInfo: {
        name: 'Test User',
        avatar: 'https://example.com/avatar.jpg',
      },
    });
    expect(mockSession.allow).toHaveBeenCalledWith('test-room', 'full-access');
  });

  it('should use firstName when fullName is not available', async () => {
    const mockSession = {
      allow: jest.fn(),
      FULL_ACCESS: 'full-access',
      authorize: jest.fn().mockResolvedValue({
        body: 'auth-token-body',
        status: 200,
      }),
    };

    const mockLiveblocks = {
      prepareSession: jest.fn().mockReturnValue(mockSession),
    };

    (Liveblocks as jest.Mock).mockImplementation(() => mockLiveblocks);

    mockAuth.mockResolvedValue({
      isAuthenticated: true,
      orgId: 'org-123',
    } as any);
    mockCurrentUser.mockResolvedValue({
      id: 'user-123',
      fullName: null,
      firstName: 'Test',
      imageUrl: 'https://example.com/avatar.jpg',
    } as any);
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('board-123'),
    });
    mockFindUnique.mockResolvedValue({
      id: 'board-123',
      orgId: 'org-123',
    } as any);

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(mockLiveblocks.prepareSession).toHaveBeenCalledWith('user-123', {
      userInfo: {
        name: 'Test',
        avatar: 'https://example.com/avatar.jpg',
      },
    });
  });

  it('should use Anonymous when name is not available', async () => {
    const mockSession = {
      allow: jest.fn(),
      FULL_ACCESS: 'full-access',
      authorize: jest.fn().mockResolvedValue({
        body: 'auth-token-body',
        status: 200,
      }),
    };

    const mockLiveblocks = {
      prepareSession: jest.fn().mockReturnValue(mockSession),
    };

    (Liveblocks as jest.Mock).mockImplementation(() => mockLiveblocks);

    mockAuth.mockResolvedValue({
      isAuthenticated: true,
      orgId: 'org-123',
    } as any);
    mockCurrentUser.mockResolvedValue({
      id: 'user-123',
      fullName: null,
      firstName: null,
      imageUrl: 'https://example.com/avatar.jpg',
    } as any);
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('board-123'),
    });
    mockFindUnique.mockResolvedValue({
      id: 'board-123',
      orgId: 'org-123',
    } as any);

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    expect(mockLiveblocks.prepareSession).toHaveBeenCalledWith('user-123', {
      userInfo: {
        name: 'Anonymous',
        avatar: 'https://example.com/avatar.jpg',
      },
    });
  });

  it('should return 500 when an error occurs', async () => {
    mockAuth.mockResolvedValue({
      isAuthenticated: true,
      orgId: 'org-123',
    } as any);
    mockCurrentUser.mockResolvedValue({
      id: 'user-123',
      fullName: 'Test User',
      imageUrl: 'https://example.com/avatar.jpg',
    } as any);
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('board-123'),
    });

    const error = new Error('Database error');
    mockFindUnique.mockRejectedValue(error);

    const req = new Request('http://localhost:3000/api/liveblocks-auth', {
      method: 'POST',
      body: JSON.stringify({ room: 'test-room' }),
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({
      error: 'Internal server error',
      message: 'Database error',
    });
  });
});
