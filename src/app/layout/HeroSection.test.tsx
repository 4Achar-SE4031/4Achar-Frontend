// HeroSection.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react'; 
import '@testing-library/jest-dom'; // Import Jest DOM matchers
import HeroSection from './HeroSection';
import { Mock, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mocking localStorage
beforeEach(() => {
  // Reset all mocks before each test
  vi.resetAllMocks();

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    },
    writable: true,
  });
});

describe('HeroSection Component', () => {

  it('should render the HeroSection component correctly', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    expect(screen.getByText(/با کنسرتیفای جادوی اجرای زنده را تجربه کنید/)).toBeInTheDocument();
    expect(screen.getByText(/رزرو آسان بهترین کنسرت‌ها و نمایش‌های تئاتر سرتاسر ایران/)).toBeInTheDocument();
  });

  it('should display the login button when there is no user token', () => {
    // Mock getItem to return null
    (window.localStorage.getItem as Mock).mockReturnValue(null);

    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    const loginButton = screen.getByText(/!بزن بریم/);
    expect(loginButton).toBeInTheDocument();
    expect(loginButton.closest('a')).toHaveAttribute('href', '/login');
  });

  it('should display the events button when there is a user token', async () => {
    // Mock getItem to return a token
    (window.localStorage.getItem as Mock).mockReturnValue('test-token');

    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    // Wait for the component to re-render after useEffect
    const eventsButton = await screen.findByText(/!بزن بریم/);
    expect(eventsButton).toBeInTheDocument();
    expect(eventsButton.closest('a')).toHaveAttribute('href', '/events/recent');
  });

  it('should render video with correct source', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    const videoElement = screen.getByTestId('hero-video');
  
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('autoPlay');
    expect(videoElement).toHaveAttribute('loop');
    
    const sourceElement = videoElement.querySelector('source');
    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveAttribute('src', expect.stringContaining('video2.mp4'));
    expect(sourceElement).toHaveAttribute('type', 'video/mp4');
  });
});
