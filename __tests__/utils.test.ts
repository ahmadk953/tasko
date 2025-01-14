import { cn, absoluteUrl } from '@/lib/utils';

describe('absoluteUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_APP_URL: 'https://example.com',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return the correct absolute URL', () => {
    const pathname = '/test';
    expect(absoluteUrl(pathname)).toBe('https://example.com/test');
  });

  it('should handle empty pathname', () => {
    const pathname = '';
    expect(absoluteUrl(pathname)).toBe('https://example.com');
  });
});

describe('cn', () => {
  it('should merge multiple class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional class names', () => {
    const isActive = true;
    expect(cn('base', isActive && 'active')).toBe('base active');

    const isDisabled = false;
    expect(cn('base', isDisabled && 'disabled')).toBe('base');
  });
});
