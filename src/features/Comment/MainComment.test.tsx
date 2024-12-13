import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MainComment from './MainComment';

describe('MainComment Component', () => {
  const mockAuth = { token: 'mock-token' };
  vi.mock('../user/login/authProvider', () => ({
    useAuth: () => mockAuth,
  }));

  it('fetches and displays comments', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ comments: [{ id: 1, text: 'Test comment' }] }),
    } as any);

    render(<MainComment id={1} />);
    expect(await screen.findByText('Test comment')).toBeInTheDocument();
  });

  it('adds a new comment', () => {
    const { getByPlaceholderText, getByText } = render(<MainComment id={1} />);
    const input = getByPlaceholderText('ثبت دیدگاه ...');
    fireEvent.change(input, { target: { value: 'New comment' } });
    const button = getByText('تایید');
    fireEvent.click(button);
    expect(screen.getByText('New comment')).toBeInTheDocument();
  });
});
