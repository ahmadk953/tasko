import { render, screen } from '@testing-library/react';
import { Header } from '@/components/modals/card-modal/header';

// Mock the necessary hooks and components
jest.mock('@/hooks/use-action', () => ({
  useAction: () => ({
    execute: jest.fn(),
  }),
}));

jest.mock('next/navigation', () => ({
  useParams: () => ({
    boardId: 'test-board-id',
  }),
}));

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(() => ({
    invalidateQueries: jest.fn(),
  })),
}));

describe('Card Modal Header Component', () => {
  it('should render with valid data', () => {
    const mockData = {
      id: 'test-card-id',
      title: 'Test Card Title',
      list: {
        id: 'test-list-id',
        title: 'Test List Title',
      },
    };

    render(<Header data={mockData} />);
    
    const titleInput = screen.getByDisplayValue('Test Card Title');
    expect(titleInput).toBeInTheDocument();
    
    const listText = screen.getByText(/in list/i);
    expect(listText).toBeInTheDocument();
    expect(screen.getByText('Test List Title')).toBeInTheDocument();
  });

  it('should handle undefined title gracefully', () => {
    // Create a mock data object without a title
    const mockData = {
      id: 'test-card-id',
      list: {
        id: 'test-list-id',
        title: 'Test List Title',
      },
    };

    // @ts-ignore - Intentionally passing incorrect data to test the fix
    render(<Header data={mockData} />);
    
    // Should render with empty title
    const titleInput = screen.getByRole('textbox', { name: /title/i });
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveValue('');
    
    // List title should still be displayed
    expect(screen.getByText('Test List Title')).toBeInTheDocument();
  });
});