import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Search from './search';
import { SearchProvider } from './searchStatus';
import '@testing-library/jest-dom';
import axios from 'axios';
import Lottie from 'react-lottie';
import AuthProvider from '../user/login/authProvider';
// Mocking axios
vi.mock('axios');

// Helper function to render the component inside the necessary context
const renderWithSearchProvider = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
    <AuthProvider>
      <SearchProvider>{ui}</SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Search Component', () => {
  it('renders loading animation while fetching data', () => {
    // Mocking axios to resolve with data
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithSearchProvider(<Search />);

    // Expecting the loading animation to be visible when the search is loading
    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('shows error animation when there is an error in fetching data', async () => {
    // Mocking axios to simulate an error
    axios.get.mockRejectedValueOnce(new Error('Server Error'));

    renderWithSearchProvider(<Search />);

    // Wait for the error state to be shown
    await waitFor(() => expect(screen.getByTestId('error-animation')).toBeInTheDocument());
  });

  it('displays "Page Not Found" when no results are found', async () => {
    // Mocking axios to return empty data
    axios.get.mockResolvedValueOnce({ data: [] });

    renderWithSearchProvider(<Search />);

    // Wait for the not found page to appear
    await waitFor(() => expect(screen.getByText('Page Not Found')).toBeInTheDocument());
  });

  it('displays the concert results after successful search', async () => {
    // Mocking axios to return some sample data
    const mockData = [
      {
        id: 1,
        title: 'Concert 1',
        location: 'Location 1',
        startDateTime: '2025-02-20T18:00:00Z',
        cardImage: 'concert-image-url',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });

    renderWithSearchProvider(<Search />);

    // Wait for the search results to appear
    await waitFor(() => expect(screen.getByText('Concert 1')).toBeInTheDocument());

    // Check if the data is rendered properly
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByText('20 بهمن 1403، 21:00')).toBeInTheDocument();
  });

  it('navigates to concert details page when a concert card is clicked', async () => {
    // Mocking axios to return some sample data
    const mockData = [
      {
        id: 1,
        title: 'Concert 1',
        location: 'Location 1',
        startDateTime: '2025-02-20T18:00:00Z',
        cardImage: 'concert-image-url',
      },
    ];
    axios.get.mockResolvedValueOnce({ data: mockData });

    const { container } = renderWithSearchProvider(<Search />);

    // Wait for the concert card to appear
    await waitFor(() => expect(screen.getByText('Concert 1')).toBeInTheDocument());

    // Simulate a click on the concert card
    fireEvent.click(screen.getByText('Concert 1'));

    // Check if navigation happened (you can check this based on your routing setup)
    expect(window.location.pathname).toBe('/concertDetail/1');
  });
});
