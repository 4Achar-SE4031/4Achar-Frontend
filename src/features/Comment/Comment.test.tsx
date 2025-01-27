// Comment.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Comment from './Comment';
import { BrowserRouter } from 'react-router-dom';
import agent from '../../app/api/agent';
import { TestProvider } from '../events/testProvider';

// Mock necessary modules
vi.mock('../../app/api/agent', () => ({
  default: {
    Comments: {
      deleteComment: vi.fn(),
      toggleLike: vi.fn(),
      updateComment: vi.fn(),
    },
  },
}));

describe('Comment Component', () => {
  const mockProps = {
    id: 1,
    currentUser: 'testUser',
    parent: null,
    comment: 'This is a test comment',
    image: 'profile.png',
    username: 'testUser',
    timeSince: '2 hours ago',
    score: 10,
    replies: [],
    updateScore: vi.fn(),
    updateComment: vi.fn(),
    setDeleteComment: vi.fn(),
    addNewReply: vi.fn(),
    hasLiked: false,
    replyingTo: null,
    replyingToName: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders comment content correctly', () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <Comment {...mockProps} />
        </TestProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('testUser')).toBeInTheDocument();
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', 'profile.png');
  });

  it('handles upvote correctly', () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <Comment {...mockProps} />
        </TestProvider>

      </BrowserRouter>
    );

    const upvoteButton = screen.getByAltText('upvote');
    fireEvent.click(upvoteButton);

    expect(mockProps.updateScore).toHaveBeenCalledWith(1, 'upvote');
  });

  it('handles downvote correctly when already liked', () => {
    const likedProps = { ...mockProps, hasLiked: true };
    render(
      <BrowserRouter>
        <TestProvider>
          <Comment {...likedProps} />
        </TestProvider>
      </BrowserRouter>
    );

    const downvoteButton = screen.getByAltText('upvote');
    fireEvent.click(downvoteButton);

    expect(mockProps.updateScore).toHaveBeenCalledWith(1, 'downvote');
  });

  it('shows edit and delete buttons for the author', () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <Comment {...mockProps} />
        </TestProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('حذف')).toBeInTheDocument();
    expect(screen.getByText('ویرایش')).toBeInTheDocument();
  });

  it('handles delete button click', () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <Comment {...mockProps} />
        </TestProvider>
      </BrowserRouter>
    );

    const deleteButton = screen.getByText('حذف');
    fireEvent.click(deleteButton);

    expect(mockProps.setDeleteComment).toHaveBeenCalledWith(1);
  });

  it('handles edit functionality', async () => {
    render(
      <BrowserRouter>
        <TestProvider>
          <Comment {...mockProps} />
        </TestProvider>
      </BrowserRouter>
    );

    const editButton = screen.getByText('ویرایش');
    fireEvent.click(editButton);

    const textarea = screen.getByPlaceholderText('ویرایش دیدگاه...');
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: 'Updated comment' } });

    const confirmButton = screen.getByText('تایید');
    fireEvent.click(confirmButton);

    expect(mockProps.updateComment).toHaveBeenCalledWith('Updated comment', 1);
  });

  it('shows reply box when reply button is clicked', () => {
    const nonAuthorProps = { ...mockProps, username: 'otherUser' };
    render(
      <BrowserRouter>
        <TestProvider>
          <Comment {...nonAuthorProps} />
        </TestProvider>
      </BrowserRouter>
    );

    const replyButton = screen.getByText('پاسخ دادن');
    fireEvent.click(replyButton);

    expect(screen.getByPlaceholderText('ثبت دیدگاه')).toBeInTheDocument();
  });
});
