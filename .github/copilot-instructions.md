# GitHub Copilot Instructions for Tasko

## Project Overview

Tasko is an open-source task management application built with Next.js. It helps users manage tasks efficiently using kanban boards with features like real-time collaboration, drag-and-drop functionality, and board customization.

**Current Status**: Alpha - Not production ready. Essential features like data encryption are still missing.

## Tech Stack

### Core Technologies

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict mode enabled)
- **UI**: React 19+
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Security**: Arcjet (rate limiting, bot detection)
- **Real-time**: Liveblocks
- **Error Tracking**: Sentry
- **Payments**: Stripe

### Key Libraries

- `@hello-pangea/dnd` - Drag and drop functionality
- `@tanstack/react-query` - Data fetching and caching
- `zustand` - State management
- `zod` - Schema validation
- `sonner` - Toast notifications
- `radix-ui` - Accessible UI components

## Development Setup

### Prerequisites

- Node.js (compatible with package.json engines)
- Yarn 4.6.0 (managed via Corepack)

### Installation

```bash
yarn install --immutable
```

### Common Commands

- `yarn dev` - Start dev server (with Turbo)
- `yarn build` - Production build
- `yarn start` - Start production server
- `yarn lint` - Run ESLint and TypeScript checks
- `yarn format` - Check code formatting
- `yarn format:fix` - Fix formatting issues
- `yarn test` - Run tests with Jest
- `yarn coverage` - Run tests with coverage

## Code Standards

### TypeScript

- Always use TypeScript with strict type checking
- No `any` types unless absolutely necessary
- Define interfaces for component props
- Use type inference where appropriate
- Run `tsc --noemit` to catch type errors

### React & Next.js

- Use React Server Components by default
- Mark Client Components explicitly with `'use client'`
- Follow Next.js App Router conventions
- Use the `app/` directory structure
- Leverage Server Actions for mutations (in `actions/` directory)
- Use `@` alias for imports (configured in tsconfig.json)

### Component Structure

- Place reusable components in `components/`
- Use feature-specific components in route folders (e.g., `app/(platform)/(dashboard)/board/[boardId]/_components/`)
- Follow naming conventions: PascalCase for components, kebab-case for files
- Export named components (e.g., `export const ComponentName`)

### Styling

- Use Tailwind CSS utility classes
- Follow existing color scheme (defined in tailwind.config.ts)
- Support both light and dark modes
- Use `cn()` utility for conditional class names
- Prefer Tailwind over custom CSS

### State Management

- Use Zustand for global state (see `hooks/` directory)
- Use React Query for server state
- Use React Context sparingly
- Prefer server-side data fetching where possible

## Database & Prisma

### Schema Management

- All models are defined in `prisma/schema.prisma`
- Main models: Board, List, Card, AuditLog, OrgLimit, OrgSubscription
- Use UUIDs for primary keys
- Include `createdAt` and `updatedAt` timestamps
- Use proper indexing for foreign keys

### Database Operations

- Use Prisma Client (imported from `@/lib/db`)
- Always handle errors in try-catch blocks
- Use transactions for related operations
- Consider organization-level data isolation (orgId)

### Server Actions

- Define in `actions/` directory
- Use `createSafeAction` wrapper with Zod schemas
- Structure: `schema.ts`, `types.ts`, and `index.ts`
- Always validate input with Zod
- Return proper error messages

## Security & Authentication

### Clerk Authentication

- Use `auth()` from `@clerk/nextjs/server` for authentication
- Always check `userId` and `orgId` in server actions
- Return proper error responses for unauthorized access

### Arcjet Security

- Configured in `lib/arcjet.ts`
- Use rate limiting for API endpoints
- Implement bot detection where needed
- Protect signup/sensitive endpoints

### General Security

- Never commit secrets to the repository
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize data before rendering (DOMPurify available)

## Testing

### Test Structure

- Tests are in `__tests__/` directory
- Use Jest with React Testing Library
- Write tests for new features and bug fixes
- Aim for meaningful coverage, not just high percentages

### Running Tests

- Always run tests before submitting PRs: `yarn test`
- Check coverage with: `yarn coverage`
- Tests should pass before merging

## Linting & Formatting

### ESLint

- Configuration in `eslint.config.mjs`
- Extends Next.js and Prettier configs
- Includes TypeScript and React Compiler plugins
- Fix issues before committing

### Prettier

- Configuration in `.prettierrc.json`
- Includes Tailwind CSS plugin
- Run `yarn format:fix` to auto-format

### Pre-submission Checklist

1. Run `yarn lint` - Must pass
2. Run `yarn format` - Must pass
3. Run `yarn test` - Must pass
4. Verify changes work in dev environment

## File Organization

```
tasko/
├── .github/          # GitHub configs (workflows, dependabot)
├── __tests__/        # Jest test files
├── actions/          # Server actions with Zod validation
├── app/              # Next.js App Router pages
│   ├── (marketing)/  # Public marketing pages
│   └── (platform)/   # Authenticated platform
├── components/       # Reusable React components
│   └── ui/           # Base UI components (shadcn/ui)
├── config/           # Configuration files
├── constants/        # App constants
├── docs/             # Documentation (MDX)
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configs
├── prisma/           # Database schema
├── public/           # Static assets
└── types.ts          # Shared TypeScript types
```

## Best Practices

### Code Quality

- Write self-documenting code with clear variable names
- Keep functions small and focused
- Avoid deep nesting
- Handle errors gracefully
- Add comments only when necessary to explain "why", not "what"

### Performance

- Use React Compiler (enabled in next.config.ts)
- Optimize images with Next.js Image component
- Implement proper caching strategies
- Use Server Components for non-interactive content
- Leverage Prisma Accelerate for database queries

### Accessibility

- Use semantic HTML
- Include proper ARIA labels
- Ensure keyboard navigation works
- Use Radix UI components (already accessible)
- Test with screen readers when possible

### Real-time Features

- Use Liveblocks for collaborative features
- Configure in `liveblocks.config.ts`
- Handle connection states properly

## Common Patterns

### Server Actions

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';
import { ActionSchema } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: 'Unauthorized' };
  }

  try {
    // Implementation
  } catch (error) {
    return { error: 'Error message' };
  }
};

export const actionName = createSafeAction(ActionSchema, handler);
```

### Client Components with Hooks

```typescript
'use client';

import { useAction } from '@/hooks/use-action';
import { actionName } from '@/actions/action-name';

export const Component = () => {
  const { execute, isLoading } = useAction(actionName, {
    onSuccess: (data) => {
      // Handle success
    },
    onError: (error) => {
      // Handle error
    },
  });

  // Component implementation
};
```

## Environment Variables

Required environment variables (never commit actual values):

- `DATABASE_URL` - PostgreSQL connection string
- `DATABASE_DIRECT_URL` - Direct database access URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `ARCJET_KEY` - Arcjet security key
- `LIVEBLOCKS_SECRET_KEY` - Liveblocks secret
- `STRIPE_API_KEY` - Stripe secret key
- `SENTRY_AUTH_TOKEN` - Sentry authentication
- `CODECOV_TOKEN` - Codecov upload token

## Contributing

1. Follow the development setup instructions
2. Create a feature branch
3. Make minimal, focused changes
4. Write/update tests as needed
5. Ensure all checks pass (lint, format, test)
6. Submit a pull request with clear description

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Project Documentation](https://docs.tasko.ahmadk953.org/)
