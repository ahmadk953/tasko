import '@testing-library/jest-dom';

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
