// NewComment.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import NewComment from './NewComment';

describe('NewComment Component', () => {
  const mockProps = {
    addNewComment: vi.fn(),
    currentUser: { profile_picture: 'profile.png' },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the textarea and send button', () => {
    render(<NewComment {...mockProps} />);

    expect(screen.getByPlaceholderText('ثبت دیدگاه ...')).toBeInTheDocument();
    expect(screen.getByText('ارسال')).toBeInTheDocument();
    expect(screen.getByAltText('current user avatar')).toHaveAttribute('src', '/src/assets/Images/profile.png');
  });

  it('calls addNewComment with correct input when send button is clicked', () => {
    render(<NewComment {...mockProps} />);

    const textarea = screen.getByPlaceholderText('ثبت دیدگاه ...');
    const sendButton = screen.getByText('ارسال');

    fireEvent.change(textarea, { target: { value: 'Test new comment' } });
    fireEvent.click(sendButton);

    expect(mockProps.addNewComment).toHaveBeenCalledWith('Test new comment');
    expect(textarea).toHaveValue('');
  });

  it('does not call addNewComment when input is empty', () => {
    render(<NewComment {...mockProps} />);

    const sendButton = screen.getByText('ارسال');
    fireEvent.click(sendButton);

    expect(mockProps.addNewComment).not.toHaveBeenCalled();
  });
});
