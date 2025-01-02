import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CardForm } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/card-form';
import { toast } from 'sonner';

jest.mock('@/hooks/use-action', () => ({
  useAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockImplementation(({ title }) => {
      toast.success(`Card "${title}" created`);
    }),
  })),
}));

jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({
    boardId: 'test-board-id',
  })),
}));

let isEditing;

const mockEnableEditing = jest.fn(() => {
  isEditing = true;
});

const mockDisableEditing = jest.fn(() => {
  isEditing = false;
});
const mockListId = 'test-list-id';

describe('CardForm', () => {
  it('should render correctly in browser environment', () => {
    render(
      <CardForm
        listId={mockListId}
        isEditing={true}
        enableEditing={mockEnableEditing}
        disableEditing={mockDisableEditing}
      />
    );
    expect(
      screen.getByPlaceholderText(/Enter a title for this card\.\.\./i)
    ).toBeInTheDocument();
  });

  it('should create a new card when form is submitted using button', async () => {
    render(
      <CardForm
        listId={mockListId}
        isEditing={true}
        enableEditing={mockEnableEditing}
        disableEditing={mockDisableEditing}
      />
    );

    const input = await screen.getByPlaceholderText(
      'Enter a title for this card...'
    );
    fireEvent.change(input, { target: { value: 'New Card' } });
    fireEvent.click(screen.getByText(/Add Card/i));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Card "New Card" created');
    });
  });

  it('should create a new card when form is submitted using the enter key', async () => {
    render(
      <CardForm
        listId={mockListId}
        isEditing={true}
        enableEditing={mockEnableEditing}
        disableEditing={mockDisableEditing}
      />
    );

    const input = await screen.getByPlaceholderText(
      'Enter a title for this card...'
    );
    fireEvent.change(input, { target: { value: 'New Card' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Card "New Card" created');
    });
  });
});
