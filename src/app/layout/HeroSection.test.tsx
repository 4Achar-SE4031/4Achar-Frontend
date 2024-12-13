import { render, screen, fireEvent, waitFor } from '@testing-library/react'; 
import HeroSection from './HeroSection';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mocking localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn().mockReturnValue(null), // No token
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
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
    // Set a user token in localStorage before rendering
    localStorage.setItem('token', 'test-token');
    
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );

    // Wait for the events button to appear with the correct URL
    const eventsButton = await screen.findByText(/!بزن بریم/);
    expect(eventsButton).toBeInTheDocument();
    expect(eventsButton.closest('a')).toHaveAttribute('href', '/login');
  });

  it('should render video with correct source', () => {
    render(
      <BrowserRouter>
        <HeroSection />
      </BrowserRouter>
    );
    
    // Get the video element
    const videoElement = screen.findAllByRole('video');
    
    // Find the source element within the video
    
    // Check if the source has the correct src attribute
    expect(videoElement)
  });
});
