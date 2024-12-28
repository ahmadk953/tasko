import '@testing-library/jest-dom';

jest.mock('@clerk/nextjs/server', () => {
  return {
    auth: jest.fn().mockImplementation(() => {
      return {
        run: () => Promise.resolve({ id: '' }),
      };
    }),
  };
});
