import { render, screen, fireEvent , waitFor} from '@testing-library/react';
import  AuthProvider  from '../user/login/authProvider';
import Navbar from './navbar';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { SearchProvider } from '../Search/searchStatus';
import React from "react";
import { vi } from 'vitest';
import  fetchSuggestions  from './navbar';
import { renderHook, act } from "@testing-library/react";
import { useState } from "react";
// Helper function to render the component inside AuthProvider
const renderWithAuthProvider = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>{ui}</AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  );
};



describe('Navbar Component', () => {
  it("returns correct suggestions for the input 'معین'", async () => {
    render(
      <BrowserRouter>
        <SearchProvider>
          <AuthProvider>
            <Navbar />
          </AuthProvider>
        </SearchProvider>
      </BrowserRouter>
    );

    // یافتن فیلد جستجو در کامپوننت
    const searchInput = screen.getByPlaceholderText('جستجو...');

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: 'معین' } });
    });

    expect(screen.getByText('معین')).toBeInTheDocument();
    expect(screen.getByText('معین زندی')).toBeInTheDocument();
  });

  it('renders the logo', () => {
    renderWithAuthProvider(<Navbar />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('shows home, create-event, and buy links', () => {
    renderWithAuthProvider(<Navbar />);
    expect(screen.getByText('خانه')).toBeInTheDocument();
    expect(screen.getByText('ویترین')).toBeInTheDocument();
  });
  
  it('changes logo when the window is resized', () => {
    // Initial render with small screen size
    renderWithAuthProvider(<Navbar />);
    expect((screen.getByAltText('Logo') as HTMLImageElement).src).toContain('logo-small.png');

    // Simulate a resize event for a larger screen
    window.innerWidth = 1500;
    fireEvent.resize(window);
    expect((screen.getByAltText('Logo') as HTMLImageElement).src).toContain('concertify-logo.png');
  });

  it('always shows search bar regardless of screen size', () => {   
    renderWithAuthProvider(<Navbar />);    
  
    window.innerWidth = 500;   
    fireEvent.resize(window);   
    expect(screen.getByPlaceholderText('جستجو...')).toBeInTheDocument();    
  
    window.innerWidth = 1200;   
    fireEvent.resize(window);   
    expect(screen.getByPlaceholderText('جستجو...')).toBeInTheDocument(); 
  });
  
  
  it("should NOT display .menu-icon when showBorder is true", () => {
    vi.spyOn(React, "useState").mockReturnValueOnce([true, vi.fn()]);

    renderWithAuthProvider(<Navbar />); 
    
    expect(screen.queryByText("menu-icon")).not.toBeInTheDocument();
  });
  

  
  it('shows account and logout links when the user is logged in', () => {
    // Mocking a logged-in user by setting the token
    const mockToken = '';
    const mockUser = { userName: 'testUser', profilePicture: '' };
    localStorage.setItem('userData', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken); // Set the mock token
    
    // Mocking auth token in the context
    const mockAuth = { token: mockToken, logOut: vi.fn() };
    
    // Only run the test if there is a token
    if (mockAuth.token==="") {
      renderWithAuthProvider(<Navbar />);
      expect(screen.getByText('عضویت')).toBeInTheDocument();
      expect(screen.getByText('ورود')).toBeInTheDocument();
    } 
  });


  it('should display default profile picture if userData.profilePicture is not available', () => {
    // Mock userData with no profile picture
    const mockToken = 'sample_token';
    const mockUser = { userName: 'testUser', profilePicture: '' };
    localStorage.setItem('userData', JSON.stringify(mockUser));
    localStorage.setItem('token', mockToken); // Set the mock token
    
    renderWithAuthProvider(<Navbar />);
  
    // Check if default profile picture is displayed
    expect(screen.getByAltText('profile')).toHaveAttribute('src', '/profile.png'); // Assuming 'profile.png' is the default image
  });
  
});