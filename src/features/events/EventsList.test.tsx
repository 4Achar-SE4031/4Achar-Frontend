// EventsList.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides jest-dom matchers
import { vi } from 'vitest';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

import EventsList from './EventsList';
import { TestProvider } from './testProvider';
import agent from '../../app/api/agent'; // Adjust path as needed


beforeAll(() => {
  window.scrollTo = vi.fn();
});



vi.mock('lottie-web');

vi.mock('../../app/api/agent', () => {
  const listMock = vi.fn((queryParams) => {
    if (queryParams && queryParams.includes('Skip=15')) {
      // Simulate second page data (Events 16-30)
      return Promise.resolve(
        Array.from({ length: 15 }, (_, i) => ({
          id: i + 16,
          title: `Event ${i + 16}`,
          details: '',
          startDate: '',
          startHour: '',
          photo: '',
          category: '',
          rating: 0,
        }))
      );
    }
    // Simulate first call with 30 events to have totalPages = 2
    return Promise.resolve(
      Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Event ${i + 1}`,
        details: '',
        startDate: '',
        startHour: '',
        photo: '',
        category: '',
        rating: 0,
      }))
    );
  });

  return {
    default: {
      Events: {
        list: listMock,
      },
    },
  };
});
vi.mock('../../app/common/Pagination', () => ({
  default: ({ count, page, onChange }: { count: number; page: number; onChange: (event: any, value: number) => void }) => {
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
    // Set up a resolved mock for agent.Events.list
    // (agent.Events.list as vi.Mock).mockResolvedValue([]);
    const { Events } = vi.mocked(agent)
    vi.mocked(Events.list).mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <EventsList />
        </TestProvider>
      </MemoryRouter>
    );

    // Because EventsList sets title in a useEffect based on route,
    // if you want it to detect “recent”, you can manually mock
    // the location or pass initial route. 
    // Or if your component uses location directly, you might
    // need MemoryRouter with initialEntries.

    // Wait for any asynchronous side effects
    await waitFor(() => {
      // If you expect the heading 'جدیدترین رویدادها' to appear
      expect(screen.getByText('جدیدترین رویدادها')).toBeInTheDocument();
    });
  });

  it('should display events fetched from the API', async () => {

    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <EventsList />
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for the component to finish loading events
    await waitFor(() => {
      const oneMatches = screen.queryAllByText('Event 1');
      const twoMatches = screen.queryAllByText('Event 2');
      expect(oneMatches.length).toBeGreaterThan(0);
      expect(twoMatches.length).toBeGreaterThan(0);
    });
  });

  it('should handle pagination click', async () => {


    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <EventsList />
        </TestProvider>
      </MemoryRouter>
    );

    // Page 1 items
    await waitFor(() => {
      const oneMatches = screen.queryAllByText('Event 1');
      const twoMatches = screen.queryAllByText('Event 15');
      expect(oneMatches.length).toBeGreaterThan(0);
      expect(twoMatches.length).toBeGreaterThan(0);
    });

    const page2Button = screen.getByTestId("pagination-button-2");
    fireEvent.click(page2Button);


    await waitFor(() => {
      const oneMatches = screen.queryAllByText('Event 16');
      const twoMatches = screen.queryAllByText('Event 29');
      expect(oneMatches.length).toBeGreaterThan(0);
      expect(twoMatches.length).toBeGreaterThan(0);
    });
    expect(screen.queryByText('Event 1')).not.toBeInTheDocument();
  });
  it('should display fallback message when no events are fetched', async () => {
    const { Events } = vi.mocked(agent);
    (Events.list as jest.Mock).mockResolvedValue([]);
  
    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <EventsList />
        </TestProvider>
      </MemoryRouter>
    );
  
    // Wait for the fallback message
    await waitFor(() => {
      expect(screen.getByText('رویدادی یافت نشد.')).toBeInTheDocument();
    });
  });

});
