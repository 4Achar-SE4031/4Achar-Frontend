// DeleteModal.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteModal from './DeleteModal';
import { TestProvider } from '../events/testProvider';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import agent from '../../app/api/agent';

// Mock the agent module
vi.mock('../../app/api/agent', () => ({
  default: {
    Comments: {
      deleteComment: vi.fn(),
    },
  },
}));

describe('DeleteModal Component', () => {
  const mockProps = {
    id: 1,
    setDeleteComment: vi.fn(),
    setData: vi.fn(),
    data: [],
    setInitialFetchDone: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks(); // Reset all mocks before each test
  });

  it('renders the modal with correct text', () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <DeleteModal {...mockProps} />
        </TestProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('حذف دیدگاه')).toBeInTheDocument();
    // Use a regex to match the complete sentence or a part of it
    expect(
      screen.getByText(/آیا مطمئنید که می‌خواهید این دیدگاه را حذف کنید\؟/)
    ).toBeInTheDocument();
  });

  it('triggers cancel action', () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <DeleteModal {...mockProps} />
        </TestProvider>
      </MemoryRouter>
    );

    const cancelButton = screen.getByText('نه، لغو');
    fireEvent.click(cancelButton);
    expect(mockProps.setDeleteComment).toHaveBeenCalledWith(false);
  });

  it('triggers confirm action', async () => {
    // Mock the deleteComment API call to resolve successfully
    (agent.Comments.deleteComment as vi.Mock).mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <TestProvider>
          <DeleteModal {...mockProps} />
        </TestProvider>
      </MemoryRouter>
    );

    const confirmButton = screen.getByText('بله، حذف');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(agent.Comments.deleteComment).toHaveBeenCalledWith(1);
      expect(mockProps.setDeleteComment).toHaveBeenCalledWith(false);
      expect(mockProps.setData).toHaveBeenCalledWith([]);
      expect(mockProps.setInitialFetchDone).toHaveBeenCalledWith(false);
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => { });
    // Mock the deleteComment API call to reject with an error
    (agent.Comments.deleteComment as vi.Mock).mockRejectedValueOnce(
      new Error('API error')
    );

    render(
      <MemoryRouter>
        <TestProvider>
          <DeleteModal {...mockProps} />
        </TestProvider>
      </MemoryRouter>
    );

    const confirmButton = screen.getByText('بله، حذف');
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(agent.Comments.deleteComment).toHaveBeenCalledWith(1);
      expect(consoleError).toHaveBeenCalledWith(
        'Error deleting comment:',
        new Error('API error')
      );
    });

    consoleError.mockRestore();
  });
});
