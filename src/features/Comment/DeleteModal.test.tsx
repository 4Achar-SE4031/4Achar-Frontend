import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeleteModal from './DeleteModal';

describe('DeleteModal Component', () => {
  const mockProps = {
    id: 1,
    setDeleteComment: vi.fn(),
    setData: vi.fn(),
    data: [],
    setInitialFetchDone: vi.fn(),
  };

  it('renders the modal with correct text', () => {
    render(<DeleteModal {...mockProps} />);
    expect(screen.getByText('حذف دیدگاه')).toBeInTheDocument();
    expect(screen.getByText('آیا مطمئنید که می‌خواهید این دیدگاه را حذف کنید؟')).toBeInTheDocument();
  });

  it('triggers cancel action', () => {
    render(<DeleteModal {...mockProps} />);
    const cancelButton = screen.getByText('نه، لغو');
    fireEvent.click(cancelButton);
    expect(mockProps.setDeleteComment).toHaveBeenCalledWith(false);
  });

  it('triggers confirm action', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: true } as any);
    render(<DeleteModal {...mockProps} />);
    const confirmButton = screen.getByText('بله، حذف');
    fireEvent.click(confirmButton);
    expect(mockProps.setDeleteComment).toHaveBeenCalledWith(false);
  });
});
