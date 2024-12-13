import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import EventsList from './EventsList'; // Adjust the import path as needed
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { TestProvider } from './testProvider';
import agent from '../../app/api/agent';

// Mock the API
vi.mock('../../app/api/agent', () => {
  return {
    default: {
      Events: {
        list: vi.fn(),
      },
    },
  };
});

// Mock lottie-web to prevent errors
vi.mock('lottie-web', () => ({
  loadAnimation: vi.fn(() => ({
    play: vi.fn(),
    stop: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe('EventsList Component', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it('should display the correct title based on eventType', async () => {
    render(
      <MemoryRouter initialEntries={['/events/recent']}>
        <TestProvider>
          <EventsList />
        </TestProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('جدیدترین رویدادها')).toBeInTheDocument();
    });
  });

  // it('should fetch and display events when filters are applied', async () => {
  //   const mockEvents = [
  //     {
  //       id: 1,
  //       title: 'Event 1',
  //       details: 'A great concert',
  //       startDate: '2024-12-14',
  //       startHour: '19:00',
  //       photo: null,
  //       province: 'Tehran',
  //       city: 'Tehran',
  //       category: 'Concert',
  //       ticket_price: 500,
  //       rating: 4.5,
  //     },
  //     {
  //       id: 2,
  //       title: 'Event 2',
  //       details: 'A great play',
  //       startDate: '2024-12-15',
  //       startHour: '20:00',
  //       photo: 'image.jpg',
  //       province: 'Tehran',
  //       city: 'Mashhad',
  //       category: 'Theater',
  //       ticket_price: 300,
  //       rating: 4.0,
  //     },
  //   ];
  //   vi.mocked(agent.Events.list).mockResolvedValue(mockEvents);

  //   render(
  //     <BrowserRouter>
  //       <TestProvider>
  //         <EventsList />
  //       </TestProvider>
  //     </BrowserRouter>
  //   );

  //   await waitFor(() => {
  //     expect(agent.Events.list).toHaveBeenCalled();
  //     expect(screen.getByText('Event 1')).toBeInTheDocument();
  //     expect(screen.getByText('Event 2')).toBeInTheDocument();
  //   });
  // });

  // it('should show loading animation while fetching events', async () => {
  //   vi.mocked(agent.Events.list).mockImplementation(
  //     () =>
  //       new Promise((resolve) => {
  //         setTimeout(() => resolve([]), 100); // Simulate delay
  //       })
  //   );

  //   render(
  //     <BrowserRouter>
  //       <TestProvider>
  //         <EventsList />
  //       </TestProvider>
  //     </BrowserRouter>
  //   );

  //   expect(screen.queryByTestId('loading')).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(agent.Events.list).toHaveBeenCalled();
  //   });
  // });

  // it('should change the page when pagination is clicked', async () => {
  //   const mockEventsPage1 = [
  //     {
  //       id: 1,
  //       title: 'Event 1',
  //       details: 'A great concert',
  //       startDate: '2024-12-14',
  //       startHour: '19:00',
  //       photo: null,
  //       province: 'Tehran',
  //       city: 'Tehran',
  //       category: 'Concert',
  //       ticket_price: 500,
  //       rating: 4.5,
  //     },
  //   ];
  //   const mockEventsPage2 = [
  //     {
  //       id: 2,
  //       title: 'Event 2',
  //       details: 'A great play',
  //       startDate: '2024-12-15',
  //       startHour: '20:00',
  //       photo: 'image.jpg',
  //       province: 'Tehran',
  //       city: 'Mashhad',
  //       category: 'Theater',
  //       ticket_price: 300,
  //       rating: 4.0,
  //     },
  //   ];

  //   vi.mocked(agent.Events.list)
  //     .mockResolvedValueOnce(mockEventsPage1) // First page
  //     .mockResolvedValueOnce(mockEventsPage2); // Second page

  //   render(
  //     <BrowserRouter>
  //       <TestProvider>
  //         <EventsList />
  //       </TestProvider>
  //     </BrowserRouter>
  //   );

  //   await waitFor(() => {
  //     expect(screen.getByText('Event 1')).toBeInTheDocument();
  //   });

  //   fireEvent.click(screen.getByText('2')); // Simulate pagination click

  //   await waitFor(() => {
  //     expect(screen.getByText('Event 2')).toBeInTheDocument();
  //   });
  // });
});
