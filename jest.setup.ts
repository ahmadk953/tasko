import '@testing-library/jest-dom';
import { toast } from 'sonner';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
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
