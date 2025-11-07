import { GET } from '@/app/api/unsplash/route';
import { auth } from '@clerk/nextjs/server';
import arcjet from '@/lib/arcjet';
import { unsplash } from '@/lib/unsplash';

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/arcjet', () => {
  const mockProtect = jest.fn().mockResolvedValue({
    isDenied: jest.fn().mockReturnValue(false),
    reason: undefined,
  });
  
  return {
    __esModule: true,
    default: {
      withRule: jest.fn(() => ({
        protect: mockProtect,
      })),
    },
    fixedWindow: jest.fn(() => ({})),
    // Expose mockProtect so tests can override it
    getMockProtect: () => mockProtect,
  };
});

jest.mock('@/lib/unsplash', () => ({
  unsplash: {
    photos: {
      getRandom: jest.fn(),
    },
  },
}));

describe('/api/unsplash GET', () => {
  const mockAuth = auth as jest.MockedFunction<typeof auth>;
  const mockGetRandom = unsplash.photos.getRandom as jest.MockedFunction<
    typeof unsplash.photos.getRandom
  >;
  const arcjetMock = require('@/lib/arcjet');
  let mockProtect: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockProtect = arcjetMock.getMockProtect();
    mockProtect.mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(false),
      reason: undefined,
    });
  });

  it('should return 401 when user is not authenticated', async () => {
    mockAuth.mockResolvedValue({
      userId: null,
      orgId: null,
    } as any);

    const req = new Request('http://localhost:3000/api/unsplash');
    const response = await GET(req);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('should return 401 when orgId is missing', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: null,
    } as any);

    const req = new Request('http://localhost:3000/api/unsplash');
    const response = await GET(req);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data).toEqual({ error: 'Unauthorized' });
  });

  it('should return 429 when rate limit is exceeded', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    mockProtect.mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(true),
      reason: 'RATE_LIMIT',
    });

    const req = new Request('http://localhost:3000/api/unsplash');
    const response = await GET(req);

    expect(response.status).toBe(429);
    const data = await response.json();
    expect(data).toEqual({ error: 'Too many requests', reason: 'RATE_LIMIT' });
  });

  it('should return images when request is successful', async () => {
    const mockImages = [
      {
        id: 'img-1',
        urls: { full: 'https://example.com/img1.jpg', thumb: 'https://example.com/img1-thumb.jpg' },
        user: { name: 'User 1' },
      },
      {
        id: 'img-2',
        urls: { full: 'https://example.com/img2.jpg', thumb: 'https://example.com/img2-thumb.jpg' },
        user: { name: 'User 2' },
      },
    ];

    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    mockProtect.mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(false),
    });

    mockGetRandom.mockResolvedValue({
      response: mockImages,
    } as any);

    const req = new Request('http://localhost:3000/api/unsplash');
    const response = await GET(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockImages);
    expect(mockGetRandom).toHaveBeenCalledWith({
      collectionIds: ['317099'],
      count: 9,
    });
  });

  it('should handle single image response', async () => {
    const mockImage = {
      id: 'img-1',
      urls: { full: 'https://example.com/img1.jpg', thumb: 'https://example.com/img1-thumb.jpg' },
      user: { name: 'User 1' },
    };

    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    mockProtect.mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(false),
    });

    mockGetRandom.mockResolvedValue({
      response: mockImage,
    } as any);

    const req = new Request('http://localhost:3000/api/unsplash');
    const response = await GET(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual([mockImage]);
  });

  it('should return 500 when unsplash API fails', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    mockProtect.mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(false),
    });

    mockGetRandom.mockResolvedValue({
      response: null,
    } as any);

    const req = new Request('http://localhost:3000/api/unsplash');
    const response = await GET(req);

    expect(response.status).toBe(500);
    const text = await response.text();
    expect(text).toBe('Failed to get images');
  });

  it('should return 500 when an error is thrown', async () => {
    mockAuth.mockResolvedValue({
      userId: 'user-123',
      orgId: 'org-123',
    } as any);

    mockProtect.mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(false),
    });

    const error = new Error('Network error');
    mockGetRandom.mockRejectedValue(error);

    const req = new Request('http://localhost:3000/api/unsplash');
    const response = await GET(req);

    expect(response.status).toBe(500);
  });
});
