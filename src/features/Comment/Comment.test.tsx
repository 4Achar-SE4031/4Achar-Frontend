import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Comment from './Comment';

describe('Comment Component', () => {
  const mockProps = {
    id: 1,
    currentUser: 'testUser',
    parent: 0,
    comment: 'This is a test comment',
    image: 'test-image.jpg',
    username: 'testUser',
    timeSince: '2 hours ago',
    score: 10,
    replies: [],
    updateScore: vi.fn(),
    updateComment: vi.fn(),
    setDeleteComment: vi.fn(),
    addNewReply: vi.fn(),
    hasLiked: false,
  };

  it('renders the comment correctly', () => {
    render(<Comment {...mockProps} />);
    expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
  });

//   it('handles upvote correctly', () => {
//     render(<Comment {...mockProps} />);
//     const upvoteButton = screen.getByAltText('upvote');
//     fireEvent.click(upvoteButton);
//     expect(mockProps.updateScore).toHaveBeenCalledWith(1, 'upvote');
//   });

  it('disables actions for the current user', () => {
    render(<Comment {...mockProps} />);
    expect(screen.getByText('ویرایش')).toBeInTheDocument();
    expect(screen.getByText('حذف')).toBeInTheDocument();
  });

  it('triggers delete action', () => {
    render(<Comment {...mockProps} />);
    const deleteButton = screen.getByText('حذف');
    fireEvent.click(deleteButton);
    expect(mockProps.setDeleteComment).toHaveBeenCalledWith(1);
  });
});
