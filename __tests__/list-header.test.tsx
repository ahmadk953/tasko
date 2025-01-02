import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { ListHeader } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header';

jest.mock('@/hooks/use-action', () => ({
  useAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockImplementation(({ title }) => {
      Promise.resolve().then(() => {
        toast.success(`Renamed to "${title}"`);
      });
    }),
  })),
}));

const mockList = {
  id: '1',
  title: 'Test List',
  boardId: 'board1',
  order: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockOnAddCard = jest.fn();

describe('ListHeader', () => {
  it('should render correctly in browser environment', () => {
    render(<ListHeader data={mockList} onAddCard={mockOnAddCard} />);

    expect(screen.getByText('Test List')).toBeInTheDocument();
  });

  it('should switch to edit mode when clicked', async () => {
    render(<ListHeader data={mockList} onAddCard={mockOnAddCard} />);

    const listButton = screen.getByText('Test List');
    fireEvent.click(listButton);

    const editableInput = await screen.findByDisplayValue('Test List');
    expect(editableInput).toBeInTheDocument();
  });

  it('should update list title when form is blurred', async () => {
    render(<ListHeader data={mockList} onAddCard={mockOnAddCard} />);

    const listButton = screen.getByText('Test List');
    fireEvent.click(listButton);

    const editableInput = await screen.findByDisplayValue('Test List');
    fireEvent.change(editableInput, { target: { value: 'Updated Title' } });
    fireEvent.blur(editableInput);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Renamed to "Updated Title"');
    });
  });

  it('should update list title when escape key is pressed', async () => {
    render(<ListHeader data={mockList} onAddCard={mockOnAddCard} />);

    const listButton = screen.getByText('Test List');
    fireEvent.click(listButton);

    const editableInput = await screen.findByDisplayValue('Test List');
    fireEvent.change(editableInput, { target: { value: 'Updated Title' } });
    fireEvent.keyDown(editableInput, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Renamed to "Updated Title"');
    });
  });
});
