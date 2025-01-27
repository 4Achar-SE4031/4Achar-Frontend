// EventsList.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides jest-dom matchers
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import EventsList from './EventsList';
import { TestProvider } from './testProvider';
import agent from '../../app/api/agent'; // Adjust path as needed
import { SearchProvider } from '../Search/searchStatus';

// Mock window.scrollTo
beforeAll(() => {
  window.scrollTo = vi.fn();
});

// Mock lottie-web
vi.mock('lottie-web');

// Corrected Mock for agent.Events.list
vi.mock('../../app/api/agent', () => {
  const listMock = vi.fn((queryParams) => {
    const params = new URLSearchParams(queryParams);
    const skip = parseInt(params.get('Skip') || '0', 10);
    
    if (skip === 15) {
      // Second page: Events 16-30
      return Promise.resolve({
        totalCount: 30,
        concerts: Array.from({ length: 15 }, (_, i) => ({
          id: i + 16,
          title: `Event ${i + 16}`,
          details: '',
          startDate: '',
          startHour: '',
          photo: '',
          category: '',
          rating: 0,
        })),
      });
    }
    
    // First page: Events 1-15
    return Promise.resolve({
      totalCount: 30,
      concerts: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Event ${i + 1}`,
        details: '',
        startDate: '',
        startHour: '',
        photo: '',
        category: '',
        rating: 0,
      })),
    });
  });

  return {
    default: {
      Events: {
        list: listMock,
      },
    },
  };
});

// Mock Pagination Component
vi.mock('../../app/common/Pagination', () => ({
  default: ({ count, onChange }: { count: number; onChange: (event: any, value: number) => void }) => {
    const pages = Array.from({ length: count }, (_, i) => i + 1); // Create an array of page numbers
    return (
      <div>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(null, p)} // Call onChange with the page number
            data-testid={`pagination-button-${p}`} // Add test ID for easier querying
          >
            {p}
          </button>
        ))}
      </div>
    );
  },
}));

describe('EventsList Component', () => {
  beforeEach(() => {
    // Reset all mock calls before each test
    vi.clearAllMocks();
  });

  it('should display the correct title when visiting /events/recent', async () => {
    // Simulate a rejected API call
    vi.mocked(agent.Events.list).mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <SearchProvider>
            <EventsList />
          </SearchProvider>
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for the title to appear despite the API error
    await waitFor(() => {
      expect(screen.getByText('جدیدترین رویدادها')).toBeInTheDocument();
    });
  });

  it('should display events fetched from the API', async () => {
    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <SearchProvider>
            <EventsList />
          </SearchProvider>
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for the first page events to load
    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });
  });

  it('should handle pagination click', async () => {
    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <SearchProvider>
            <EventsList />
          </SearchProvider>
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for the first page events to load
    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 15')).toBeInTheDocument();
    });

    const page2Button = screen.getByTestId("pagination-button-2");
    fireEvent.click(page2Button);

    // Wait for the second page events to load
    await waitFor(() => {
      expect(screen.getByText('Event 16')).toBeInTheDocument();
      expect(screen.getByText('Event 29')).toBeInTheDocument();
    });

    // Ensure first page events are no longer present
    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
  });

  it('should display fallback message when no events are fetched', async () => {
    // Mock the API to return no events
    vi.mocked(agent.Events.list).mockResolvedValueOnce({
      totalCount: 0,
      concerts: [],
    });

    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <SearchProvider>
            <EventsList />
          </SearchProvider>
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for the fallback message to appear
    await waitFor(() => {
      expect(screen.getByText('متاسفانه رویدادی یافت نشد.')).toBeInTheDocument();
    });
  });
});
