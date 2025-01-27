// NewReply.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import NewReply from './NewReply';

describe('NewReply Component', () => {
  const mockProps = {
    parentId: 1,
    setNewReply: vi.fn(),
    addNewReply: vi.fn(),
    currentUser: 'testUser',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the textarea and reply button', () => {
    render(<NewReply {...mockProps} />);

    expect(screen.getByPlaceholderText('ثبت دیدگاه')).toBeInTheDocument();
    expect(screen.getByText('پاسخ دادن')).toBeInTheDocument();
    expect(screen.getByAltText('current user avatar')).toHaveAttribute('src', '/src/assets/Images/profile.png');
  });

  it('calls addNewReply with correct input when reply button is clicked', () => {
    render(<NewReply {...mockProps} />);

    const textarea = screen.getByPlaceholderText('ثبت دیدگاه');
    const replyButton = screen.getByText('پاسخ دادن');

    fireEvent.change(textarea, { target: { value: 'Test reply' } });
    fireEvent.click(replyButton);

    expect(mockProps.addNewReply).toHaveBeenCalledWith(1, 'Test reply');
    expect(mockProps.setNewReply).toHaveBeenCalledWith(false);
    expect(textarea).toHaveValue('');
  });

  it('does not call addNewReply when input is empty', () => {
    render(<NewReply {...mockProps} />);

    const replyButton = screen.getByText('پاسخ دادن');
    fireEvent.click(replyButton);

    expect(mockProps.addNewReply).not.toHaveBeenCalled();
    expect(mockProps.setNewReply).not.toHaveBeenCalled();
  });
});
