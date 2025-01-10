import { render, screen, fireEvent } from '@testing-library/react';
import  AuthProvider  from '../user/login/authProvider';
import Navbar from './navbar';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { SearchProvider } from '../Search/searchStatus';

// Helper function to render the component inside AuthProvider
const renderWithAuthProvider = (ui: React.ReactElement) => {
  return render(
    <SearchProvider>
      <BrowserRouter>
        <AuthProvider>{ui}</AuthProvider>
      </BrowserRouter>
    </SearchProvider>
  );
};

describe('Navbar Component', () => {
  it('renders the logo', () => {
    renderWithAuthProvider(<Navbar />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('shows home, create-event, and buy links', () => {
    renderWithAuthProvider(<Navbar />);
    expect(screen.getByText('خانه')).toBeInTheDocument();
    expect(screen.getByText('ویترین')).toBeInTheDocument();
    expect(screen.getByText('خرید ها')).toBeInTheDocument();
  });

  it('changes logo when the window is resized', () => {
    // Initial render with small screen size
    renderWithAuthProvider(<Navbar />);
    expect(screen.getByAltText('Logo').src).toContain('logo-small.png');
    
    // Simulate a resize event for a larger screen
    window.innerWidth = 1500;
    fireEvent.resize(window);

    expect(screen.getByAltText('Logo').src).toContain('concertify-logo.png');
  });

  // it('shows account and logout links when the user is logged in', () => {
  //   // Mocking a logged-in user by setting the token
  //   const mockToken = 'sample_token';
  //   const mockUser = { userName: 'testUser', profilePicture: '' };
  //   localStorage.setItem('userData', JSON.stringify(mockUser));
  //   localStorage.setItem('token', mockToken); // Set the mock token
    
  //   // Mocking auth token in the context
  //   const mockAuth = { token: mockToken, logOut: jest.fn() };
    
  //   // Only run the test if there is a token
  //   if (mockAuth.token) {
  //     renderWithAuthProvider(<Navbar />);
      
  //     expect(screen.getByText('حساب کاربری')).toBeInTheDocument();
  //     expect(screen.getByText('خروج')).toBeInTheDocument();
  //   } else {
  //     console.log('No token, skipping test.');
  //   }
  // });

});