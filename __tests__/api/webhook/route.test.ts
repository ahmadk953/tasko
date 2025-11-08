import { POST } from '@/app/api/webhook/route';
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe';

jest.mock('@/lib/db', () => ({
  db: {
    orgSubscription: {
      upsert: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: jest.fn(),
    },
    subscriptions: {
      retrieve: jest.fn(),
    },
  },
}));

// Mock arcjet - define the mockProtect inside the factory
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
      _mockProtect: mockProtect, // Expose for tests to access
    },
    fixedWindow: jest.fn(() => ({})),
  };
});

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

describe('/api/webhook POST', () => {
  const mockUpsert = db.orgSubscription.upsert as jest.MockedFunction<
    typeof db.orgSubscription.upsert
  >;
  const mockUpdate = db.orgSubscription.update as jest.MockedFunction<
    typeof db.orgSubscription.update
  >;
  const mockConstructEvent = stripe.webhooks
    .constructEvent as jest.MockedFunction<
    typeof stripe.webhooks.constructEvent
  >;
  const mockRetrieve = stripe.subscriptions.retrieve as jest.MockedFunction<
    typeof stripe.subscriptions.retrieve
  >;
  const mockHeaders = require('next/headers').headers as jest.Mock;
  const arcjet = require('@/lib/arcjet').default;
  const mockProtect = arcjet._mockProtect;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = 'test-webhook-secret';
    // Reset mockProtect to default behavior
    mockProtect.mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(false),
      reason: undefined,
    });
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue('test-signature'),
    });
  });

  afterEach(() => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  it('should return 429 when rate limit is exceeded', async () => {
    mockProtect.mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(true),
      reason: 'RATE_LIMIT',
    });

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(429);
    const data = await response.json();
    expect(data).toEqual({ error: 'Too many requests', reason: 'RATE_LIMIT' });
  });

  it('should return 400 when signature is missing', async () => {
    mockHeaders.mockResolvedValue({
      get: jest.fn().mockReturnValue(null),
    });

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: 'Missing signature' });
  });

  it('should return 500 when webhook secret is not configured', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Server misconfiguration' });
  });

  it('should return 400 when signature verification fails', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: 'Invalid webhook signature' });
  });

  it('should handle checkout.session.completed event successfully', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'session-123',
          customer: 'cus-123',
          subscription: 'sub-123',
          metadata: {
            orgId: 'org-123',
          },
        },
      },
    };

    const mockSubscription = {
      id: 'sub-123',
      items: {
        data: [
          {
            price: {
              id: 'price-123',
            },
          },
        ],
      },
      current_period_end: 1700000000,
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);
    mockRetrieve.mockResolvedValue(mockSubscription as any);
    mockUpsert.mockResolvedValue({} as any);

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });
    expect(mockRetrieve).toHaveBeenCalledWith('sub-123', {
      expand: ['items.data.price'],
    });
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { orgId: 'org-123' },
      create: {
        orgId: 'org-123',
        stripeSubscriptionId: 'sub-123',
        stripeCustomerId: 'cus-123',
        stripePriceId: 'price-123',
        stripeCurrentPeriodEnd: new Date(1700000000 * 1000),
      },
      update: {
        stripeSubscriptionId: 'sub-123',
        stripeCustomerId: 'cus-123',
        stripePriceId: 'price-123',
        stripeCurrentPeriodEnd: new Date(1700000000 * 1000),
      },
    });
  });

  it('should return 400 when checkout.session.completed is missing orgId', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'session-123',
          customer: 'cus-123',
          subscription: 'sub-123',
          metadata: {},
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: 'Missing orgId' });
  });

  it('should return 400 when checkout.session.completed is missing subscription', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'session-123',
          customer: 'cus-123',
          subscription: null,
          metadata: {
            orgId: 'org-123',
          },
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toEqual({ error: 'Missing subscription id' });
  });

  it('should handle invoice.payment_succeeded event successfully', async () => {
    const mockEvent = {
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'inv-123',
          subscription: 'sub-123',
        },
      },
    };

    const mockSubscription = {
      id: 'sub-123',
      items: {
        data: [
          {
            price: {
              id: 'price-123',
            },
          },
        ],
      },
      current_period_end: 1700000000,
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);
    mockRetrieve.mockResolvedValue(mockSubscription as any);
    mockUpdate.mockResolvedValue({} as any);

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { stripeSubscriptionId: 'sub-123' },
      data: {
        stripePriceId: 'price-123',
        stripeCurrentPeriodEnd: new Date(1700000000 * 1000),
      },
    });
  });

  it('should handle invoice.payment_succeeded without subscription gracefully', async () => {
    const mockEvent = {
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'inv-123',
          subscription: null,
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it('should continue when update fails for invoice.payment_succeeded', async () => {
    const mockEvent = {
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          id: 'inv-123',
          subscription: 'sub-123',
        },
      },
    };

    const mockSubscription = {
      id: 'sub-123',
      items: {
        data: [
          {
            price: {
              id: 'price-123',
            },
          },
        ],
      },
      current_period_end: 1700000000,
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);
    mockRetrieve.mockResolvedValue(mockSubscription as any);
    mockUpdate.mockRejectedValue(new Error('Record not found'));

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });
  });

  it('should return 500 when processing fails', async () => {
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'session-123',
          customer: 'cus-123',
          subscription: 'sub-123',
          metadata: {
            orgId: 'org-123',
          },
        },
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);
    mockRetrieve.mockRejectedValue(new Error('Stripe API error'));

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data).toEqual({ error: 'Internal error' });
  });

  it('should ignore unknown event types', async () => {
    const mockEvent = {
      type: 'unknown.event.type',
      data: {
        object: {},
      },
    };

    mockConstructEvent.mockReturnValue(mockEvent as any);

    const req = new Request('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: 'raw-body',
    });

    const response = await POST(req);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ received: true });
    expect(mockUpsert).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
