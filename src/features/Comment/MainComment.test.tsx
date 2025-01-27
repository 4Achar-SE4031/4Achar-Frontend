// MainComment.test.tsx
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import MainComment from './MainComment';
import agent from '../../app/api/agent';
import { useAuth } from '../user/login/authProvider';

// Mock necessary modules
vi.mock('../../app/api/agent', () => ({
  default: {
    Comments: {
      fetchComments: vi.fn(),
      addComment: vi.fn(),
      updateComment: vi.fn(),
      toggleLike: vi.fn(),
      addReply: vi.fn(),
      deleteComment: vi.fn(),
    },
  },
}));

vi.mock('../user/login/authProvider', () => ({
  useAuth: vi.fn(),
}));

describe('MainComment Component', () => {
  const mockAuth = { token: 'test-token' };
  const mockComments = {
    comments: [
      {
        id: 1,
        text: 'First comment',
        createdAt: '2023-10-10T10:00:00Z',
        score: 5,
        userId: 'user1',
        username: 'user1',
        hasLiked: false,
        parentId: null,
        eventId: 100,
        replies: [],
        replyingTo: null,
        replyingToName: null,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as vi.Mock).mockReturnValue(mockAuth);
    (agent.Comments.fetchComments as vi.Mock).mockResolvedValue(mockComments);
  });

  it('fetches and displays comments on mount', async () => {
    render(<MainComment id={100} />);

    expect(agent.Comments.fetchComments).toHaveBeenCalledWith(100);

    await waitFor(() => {
      expect(screen.getByText('First comment')).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
    });
  });

  it('displays the new comment form when user is logged in', () => {
    const userData = { userName: 'user1', userId: 'user1' };
    localStorage.setItem('userData', JSON.stringify(userData));

    render(<MainComment id={100} />);

    expect(screen.getByPlaceholderText('ثبت دیدگاه ...')).toBeInTheDocument();
    expect(screen.getByText('ارسال')).toBeInTheDocument();
  });

  it('prompts to login when user is not logged in', () => {
    localStorage.removeItem('userData');

    render(<MainComment id={100} />);

    expect(screen.getByText(/جهت ارسال نظر، ابتدا/i)).toBeInTheDocument();
    expect(screen.getByText('وارد شوید.')).toBeInTheDocument();
  });

  it('adds a new comment correctly', async () => {
    const userData = { userName: 'user1', userId: 'user1' };
    localStorage.setItem('userData', JSON.stringify(userData));
    (agent.Comments.addComment as vi.Mock).mockResolvedValue({
      id: 2,
      text: 'New comment',
      createdAt: '2023-10-11T12:00:00Z',
      score: 0,
      userId: 'user1',
      username: 'user1',
      hasLiked: false,
      parentId: null,
      eventId: 100,
      replies: [],
      replyingTo: null,
      replyingToName: null,
    });

    render(<MainComment id={100} />);

    const textarea = screen.getByPlaceholderText('ثبت دیدگاه ...');
    const sendButton = screen.getByText('ارسال');

    fireEvent.change(textarea, { target: { value: 'New comment' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(agent.Comments.addComment).toHaveBeenCalledWith({
        eventId: 100,
        text: 'New comment',
      });
      expect(screen.getByText('New comment')).toBeInTheDocument();
    });
  });

  it('handles API errors when adding a new comment', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const userData = { userName: 'user1', userId: 'user1' };
    localStorage.setItem('userData', JSON.stringify(userData));
    (agent.Comments.addComment as vi.Mock).mockRejectedValueOnce(new Error('API error'));

    render(<MainComment id={100} />);

    const textarea = screen.getByPlaceholderText('ثبت دیدگاه ...');
    const sendButton = screen.getByText('ارسال');

    fireEvent.change(textarea, { target: { value: 'New comment' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(agent.Comments.addComment).toHaveBeenCalledWith({
        eventId: 100,
        text: 'New comment',
      });
      expect(consoleError).toHaveBeenCalledWith('Error adding comment:', new Error('API error'));
    });

    consoleError.mockRestore();
  });

  // Additional tests can be added for updating comments, deleting comments, liking, etc.
});
