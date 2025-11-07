import '@testing-library/jest-dom';

// Polyfill for Next.js server-side APIs (Request, Response, Headers)
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(public url: string, public init?: any) {}
    async text() {
      return this.init?.body || '';
    }
    async json() {
      return JSON.parse(this.init?.body || '{}');
    }
  } as any;
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(public body: any, public init?: any) {}
    get status() {
      return this.init?.status || 200;
    }
    async json() {
      return JSON.parse(this.body);
    }
    async text() {
      return this.body;
    }
  } as any;
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    private headers = new Map();
    constructor(init?: any) {
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.headers.set(key.toLowerCase(), value);
        });
      }
    }
    get(name: string) {
      return this.headers.get(name.toLowerCase()) || null;
    }
    set(name: string, value: string) {
      this.headers.set(name.toLowerCase(), value);
    }
  } as any;
}

// Mock NextResponse from Next.js
jest.mock('next/server', () => {
  class MockNextResponse {
    constructor(public body: any, public init?: any) {}
    
    get status() {
      return this.init?.status || 200;
    }

    async json() {
      if (typeof this.body === 'string') {
        try {
          return JSON.parse(this.body);
        } catch {
          return this.body;
        }
      }
      return this.body;
    }

    async text() {
      if (typeof this.body === 'string') {
        return this.body;
      }
      return JSON.stringify(this.body);
    }

    static json(data: any, init?: any) {
      return new MockNextResponse(JSON.stringify(data), init);
    }
  }

  return {
    NextResponse: MockNextResponse,
  };
});

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('lucide-react', () => ({
  MoreHorizontal: () => null,
  X: () => null,
  Medal: () => null,
}));

jest.mock('@/actions/update-list', () => ({
  updateList: jest.fn(),
}));

jest.mock('@/actions/delete-list', () => ({
  deleteList: jest.fn(),
}));

jest.mock('@/actions/copy-list', () => ({
  copyList: jest.fn(),
}));

jest.mock('@/actions/update-board', () => ({
  updateBoard: jest.fn(),
}));

jest.mock('@/actions/create-card', () => ({
  createCard: jest.fn(),
}));
