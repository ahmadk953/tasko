import '@testing-library/jest-dom';

// Ensure Node polyfills for Web APIs used by dependencies
import {
  TextEncoder as NodeTextEncoder,
  TextDecoder as NodeTextDecoder,
} from 'util';
import { webcrypto } from 'crypto';

type JsonObject = Record<string, unknown>;
type RequestInitLike = { body?: string };
type ResponseInitLike = { status?: number };

const asGlobalWithPolyfills = () => {
  return globalThis as typeof globalThis & {
    TextEncoder?: typeof NodeTextEncoder;
    TextDecoder?: typeof NodeTextDecoder;
    crypto?: Crypto;
  };
};

const parseJsonSafely = (value: unknown): unknown => {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const toJsonObject = (value: unknown): JsonObject => {
  if (value && typeof value === 'object') {
    return value as JsonObject;
  }

  return {};
};

const mockedGlobal = asGlobalWithPolyfills();

// Provide TextEncoder/TextDecoder if missing (used by Prisma/cuid2)
mockedGlobal.TextEncoder ??= NodeTextEncoder;
mockedGlobal.TextDecoder ??= NodeTextDecoder;

// Provide Web Crypto in Jest (jsdom) environment if missing
mockedGlobal.crypto ??= webcrypto as Crypto;

// Polyfill for Next.js server-side APIs (Request, Response, Headers)
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(
      public url: string,
      public init?: RequestInitLike
    ) {}

    async text() {
      return this.init?.body || '';
    }

    async json() {
      return parseJsonSafely(this.init?.body ?? '{}');
    }
  } as unknown as typeof Request;
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(
      public body: unknown,
      public init?: ResponseInitLike
    ) {}

    get status() {
      return this.init?.status || 200;
    }

    async json() {
      return parseJsonSafely(this.body);
    }

    async text() {
      return this.body;
    }
  } as unknown as typeof Response;
}

if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    private headers = new Map<string, string>();

    constructor(init?: unknown) {
      const values = toJsonObject(init);
      Object.entries(values).forEach(([key, value]) => {
        if (typeof value === 'string') {
          this.headers.set(key.toLowerCase(), value);
        }
      });
    }

    get(name: string) {
      return this.headers.get(name.toLowerCase()) || null;
    }

    set(name: string, value: string) {
      this.headers.set(name.toLowerCase(), value);
    }
  } as unknown as typeof Headers;
}

class MockNextResponse {
  constructor(
    public body: unknown,
    public init?: ResponseInitLike
  ) {}

  get status() {
    return this.init?.status || 200;
  }

  async json() {
    return parseJsonSafely(this.body);
  }

  async text() {
    if (typeof this.body === 'string') {
      return this.body;
    }

    return JSON.stringify(this.body);
  }

  static json(data: unknown, init?: ResponseInitLike) {
    return new MockNextResponse(JSON.stringify(data), init);
  }
}

// Mock NextResponse from Next.js
jest.mock('next/server', () => {
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
