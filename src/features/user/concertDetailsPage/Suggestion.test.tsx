// Suggestion.test.tsx

import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides jest-dom matchers
import { MemoryRouter } from 'react-router-dom';
import { TestProvider } from '../../events/testProvider';
import Suggestion from './Suggestion';
import agent from '../../../app/api/agent';

// **Step 1: Mock useNavigate before importing Suggestion**
const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// **Step 2: Mock EventItem component to simplify tests**
vi.mock('../../events/EventItem', () => ({
  default: ({ event }: { event: any }) => (
    <div data-testid={`event-item-${event.id}`}>{event.title}</div>
  ),
}));

// **Step 3: Mock Card component if necessary**
vi.mock('../../../app/common/Card/Card', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className}>{children}</div>
  ),
}));

// **Step 4: Mock lottie-web if Suggestion uses it (even if commented out)**
vi.mock('lottie-web');

// **Step 5: Mock the agent module correctly**
vi.mock('../../../app/api/agent', () => {
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

    return Promise.resolve({
      totalCount: 20, // Total number of events
      concerts: events, // The fetched events
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

describe('Suggestion Component', () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  beforeEach(() => {
    // Reset all mock calls and implementations before each test
    vi.clearAllMocks();
  });

  it('should render without crashing and display the correct section title', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <Suggestion />
        </TestProvider>
      </MemoryRouter>
    );

    // Check for the suggested events title
    expect(screen.getByText('رویدادهای پیشنهادی')).toBeInTheDocument();
  });

  it('should fetch and display suggested events from the API', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <Suggestion />
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for suggested events to be rendered
    await waitFor(() => {
      // Suggested Events: IDs 1-10, but eventsToShow=5
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByTestId(`event-item-${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Event ${i}`)).toBeInTheDocument();
      }
    });
  });

  it('should handle "نمایش همه" button clicks and navigate to the correct route', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <Suggestion />
        </TestProvider>
      </MemoryRouter>
    );

    // Ensure there is only one 'نمایش همه' button
    const showAllButtons = screen.getAllByText('نمایش همه');
    expect(showAllButtons.length).toBe(1);

    // Click on the "نمایش همه" button
    const showAllButton = showAllButtons[0];
    fireEvent.click(showAllButton);
    expect(mockNavigate).toHaveBeenCalledWith('/events/recent');
  });

  it('should handle slider arrow clicks for suggested events', async () => {
    render(
      <MemoryRouter>
        <TestProvider>
          <Suggestion />
        </TestProvider>
      </MemoryRouter>
    );

    // Wait for suggested events to be rendered
    await waitFor(() => {
      expect(screen.getByTestId('event-item-1')).toBeInTheDocument();
    });

    // Initial visible suggested events: 1-5
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`event-item-${i}`)).toBeInTheDocument();
    }

    // Click the "next" arrow for suggested events
    const nextButton = screen.getByRole('button', { name: /›/ }); // Only one next button
    fireEvent.click(nextButton);

    // After clicking next, visible suggested events should be 2-6
    await waitFor(() => {
      expect(screen.getByTestId('event-item-2')).toBeInTheDocument();
      expect(screen.getByTestId('event-item-6')).toBeInTheDocument();
      expect(screen.queryByTestId('event-item-1')).not.toBeInTheDocument();
    });

    // Click the "prev" arrow for suggested events
    const prevButton = screen.getByRole('button', { name: /‹/ }); // Only one prev button
    fireEvent.click(prevButton);

    // After clicking prev, visible suggested events should be back to 1-5
    await waitFor(() => {
      expect(screen.getByTestId('event-item-1')).toBeInTheDocument();
      expect(screen.queryByTestId('event-item-6')).not.toBeInTheDocument();
    });
  });

  it('should display loading state while fetching events', async () => {
    // The loading UI is commented out in the Suggestion component, so this test is not applicable
    // If you implement a loading indicator, you can adjust the test accordingly

    // Example (if loading indicator exists):
    // agent.Events.list.mockImplementationOnce(() => new Promise(() => {}));

    // render(
    //   <MemoryRouter>
    //     <TestProvider>
    //       <Suggestion />
    //     </TestProvider>
    //   </MemoryRouter>
    // );

    // expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    // Mock the API to reject
    agent.Events.list.mockRejectedValueOnce(new Error('API error'));

    render(
      <MemoryRouter>
        <TestProvider>
          <Suggestion />
        </TestProvider>
      </MemoryRouter>
    );

    // Since error handling just logs to console and doesn't render anything specific,
    // you can check that no events are rendered.

    await waitFor(() => {
      expect(screen.queryByTestId('event-item-1')).not.toBeInTheDocument();
      expect(screen.queryByTestId('event-item-2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('event-item-3')).not.toBeInTheDocument();
      expect(screen.queryByTestId('event-item-4')).not.toBeInTheDocument();
      expect(screen.queryByTestId('event-item-5')).not.toBeInTheDocument();
    });

    // Optionally, if you implement an error message in the component, test for its presence:
    // expect(screen.getByText('Failed to load events.')).toBeInTheDocument();
  });
});
