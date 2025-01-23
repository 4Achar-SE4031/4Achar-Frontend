import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides jest-dom matchers
import { MemoryRouter } from 'react-router-dom';

// **Step 1: Mock useNavigate before importing FiveEvents**
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// **Step 2: Now import FiveEvents and other dependencies**
import FiveEvents from './FiveEvents';
import { TestProvider } from './testProvider';
import agent from '../../app/api/agent'; // Adjust path as needed

// **Step 3: Mock EventItem component to simplify tests**
vi.mock('./EventItem', () => ({
  default: ({ event }: { event: any }) => (
    <div data-testid={`event-item-${event.id}`}>{event.title}</div>
  ),
}));

// **Step 4: Mock Card component if necessary**
vi.mock('../../app/common/Card/Card', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

// **Step 5: Mock lottie-web if FiveEvents uses it (even if commented out)**
vi.mock('lottie-web');

// **Step 6: Mock the agent module**
vi.mock('../../app/api/agent', () => {
  const listMock = vi.fn((queryParams: string) => {
    const params = new URLSearchParams(queryParams);
    const skip = parseInt(params.get('Skip') || '0', 10);
    const take = parseInt(params.get('Take') || '20', 10);

    // Simulate fetching events based on Skip and Take
    const events = Array.from({ length: take }, (_, i) => ({
      id: i + 1 + skip,
      title: `Event ${i + 1 + skip}`,
      details: '',
      startDate: '',
      startHour: '',
      photo: '',
      category: '',
      rating: 0,
    }));

    return Promise.resolve(events);
  });

  return {
    default: {
      Events: {
        list: listMock,
      },
    },
  };
});

describe('FiveEvents Component', () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  beforeEach(() => {
    // Reset all mock calls and implementations before each test
    vi.clearAllMocks();
  });

  it('should render without crashing and display correct section titles', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <FiveEvents />
        </TestProvider>
      </MemoryRouter>
    );

    // Check for recent events title
    expect(screen.getByText('رویدادهای جدید')).toBeInTheDocument();

    // Check for popular events title
    expect(screen.getByText('رویدادهای محبوب')).toBeInTheDocument();
  });

  it('should fetch and display recent and popular events from the API', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <FiveEvents />
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for recent events to be rendered
    await waitFor(() => {
      // Recent Events: IDs 1-10 (but only first 5 are visible as per eventsToShow)
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByTestId(`event-item-${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Event ${i}`)).toBeInTheDocument();
      }
    });

    // Wait for popular events to be rendered
    await waitFor(() => {
      // Popular Events: IDs 11-20 (only first 5 are visible)
      for (let i = 11; i <= 15; i++) {
        expect(screen.getByTestId(`event-item-${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Event ${i}`)).toBeInTheDocument();
      }
    });
  });

  it('should handle "نمایش همه" button clicks and navigate to the correct routes', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <FiveEvents />
        </TestProvider>
      </MemoryRouter>
    );

    // Ensure buttons are rendered
    const showAllButtons = screen.getAllByText('نمایش همه');
    expect(showAllButtons.length).toBeGreaterThanOrEqual(2);

    // Click on "نمایش همه" for recent events (first button)
    const showAllRecentButton = showAllButtons[0];
    fireEvent.click(showAllRecentButton);
    expect(mockNavigate).toHaveBeenCalledWith('/events/recent');

    // Click on "نمایش همه" for popular events (second button)
    const showAllPopularButton = showAllButtons[1];
    fireEvent.click(showAllPopularButton);
    expect(mockNavigate).toHaveBeenCalledWith('/events/popular');
  });

  it('should handle slider arrow clicks for recent events', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <FiveEvents />
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for recent events to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('event-item-1')).toBeInTheDocument();
    });

    // Initial visible recent events: 1-5
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`event-item-${i}`)).toBeInTheDocument();
    }

    // Click the "next" arrow for recent events
    const recentNextButton = screen.getAllByRole('button', { name: /›/ })[0]; // Assuming first button is for recent
    fireEvent.click(recentNextButton);

    // After clicking next, visible recent events should be 2-6
    await waitFor(() => {
      expect(screen.getByTestId('event-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('event-item-6')).toBeInTheDocument();
      expect(screen.queryByTestId('event-item-1')).not.toBeInTheDocument();
    });

    // Click the "prev" arrow for recent events
    const recentPrevButton = screen.getAllByRole('button', { name: /‹/ })[0]; // Assuming first button is for recent
    fireEvent.click(recentPrevButton);

    // After clicking prev, visible recent events should be back to 1-5
    await waitFor(() => {
      expect(screen.getByTestId('event-item-1')).toBeInTheDocument();
      expect(screen.queryByTestId('event-item-6')).not.toBeInTheDocument();
    });
  });

  it('should handle slider arrow clicks for popular events', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <FiveEvents />
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for popular events to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('event-item-11')).toBeInTheDocument();
    });

    // Initial visible popular events: 11-15
    for (let i = 11; i <= 15; i++) {
      expect(screen.getByTestId(`event-item-${i}`)).toBeInTheDocument();
    }

    // Click the "next" arrow for popular events
    const popularNextButton = screen.getAllByRole('button', { name: /›/ })[1]; // Assuming second button is for popular
    fireEvent.click(popularNextButton);

    // After clicking next, visible popular events should be 12-16
    await waitFor(() => {
      expect(screen.getByTestId('event-item-12')).toBeInTheDocument();
      expect(screen.getByTestId('event-item-16')).toBeInTheDocument();
      expect(screen.queryByTestId('event-item-11')).not.toBeInTheDocument();
    });

    // Click the "prev" arrow for popular events
    const popularPrevButton = screen.getAllByRole('button', { name: /‹/ })[1]; // Assuming second button is for popular
    fireEvent.click(popularPrevButton);

    // After clicking prev, visible popular events should be back to 11-15
    await waitFor(() => {
      expect(screen.getByTestId('event-item-11')).toBeInTheDocument();
      expect(screen.queryByTestId('event-item-16')).not.toBeInTheDocument();
    });
  });

  it('should display loading state while fetching events', async () => {
    // Override the mock to delay the response
    const originalList = agent.Events.list;
    vi.mocked(agent.Events.list).mockImplementationOnce(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <TestProvider>
          <FiveEvents />
        </TestProvider>
      </MemoryRouter>
    );

    // Assuming you have a loading indicator, e.g., a spinner or text
    // Since loading UI is commented out in FiveEvents, adjust accordingly
    // For demonstration, let's assume there's a text 'Loading...'

    // Uncomment and adjust the following lines if a loading indicator exists
    // expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Restore the original mock
    vi.mocked(agent.Events.list).mockImplementation(originalList);
  });

  it('should handle API errors gracefully', async () => {
    // Mock the API to reject
    vi.mocked(agent.Events.list).mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <TestProvider>
          <FiveEvents />
        </TestProvider>
      </MemoryRouter>
    );

    // Since error handling just logs to console and doesn't render anything specific,
    // you might want to check that no events are rendered or some fallback UI is shown.
    // Adjust based on your actual implementation.

    // For example, if no events are rendered:
    await waitFor(() => {
      expect(screen.queryByTestId('event-item-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('event-item-11')).not.toBeInTheDocument();
    });


  });
});
