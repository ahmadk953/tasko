import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'sonner';

import { BoardTitleForm } from '@/app/(platform)/(dashboard)/board/[boardId]/_components/board-title-form';
import { Board } from '@prisma/client';

jest.mock('@/hooks/use-action', () => ({
  useAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockImplementation(({ title }) => {
      Promise.resolve().then(() => {
        toast.success(`Board "${title}" updated!`);
      });
    }),
  })),
}));

describe('BoardTitleForm', () => {
  const mockBoard: Board = {
    id: '1',
    title: 'Test Board',
    imageId: 'image1',
    imageThumbUrl: 'thumb-url',
    imageFullUrl: 'full-url',
    imageUserName: 'user1',
    imageLinkHTML: 'link-html',
    imageDownloadUrl: 'download-url',
    createdAt: new Date(),
    updatedAt: new Date(),
    orgId: 'org1',
  };

  it('should render correctly in browser environment', () => {
    render(<BoardTitleForm data={mockBoard} />);

    const titleButton = screen.getByText('Test Board');
    expect(titleButton).toBeInTheDocument();
  });

  it('should switch to edit mode when clicked', async () => {
    render(<BoardTitleForm data={mockBoard} />);

    const titleButton = screen.getByText('Test Board');
    fireEvent.click(titleButton);

    const input = await screen.findByDisplayValue('Test Board');
    expect(input).toBeInTheDocument();
  });

  it('should update board title when form is blurred', async () => {
    render(<BoardTitleForm data={mockBoard} />);

    const titleButton = screen.getByText('Test Board');
    fireEvent.click(titleButton);

    const input = await screen.findByDisplayValue('Test Board');
    fireEvent.change(input, { target: { value: 'New Title' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Board "New Title" updated!');
    });
  });
});
