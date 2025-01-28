// Home.test.tsx

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './Home';
import { MemoryRouter } from 'react-router-dom';

// Mock subcomponents to isolate Home component tests
vi.mock('../../features/Navbar/navbar.tsx', () => ({
  default: () => <div data-testid="navbar">Navbar Component</div>,
}));

vi.mock('./HeroSection', () => ({
  default: () => <div data-testid="hero-section">HeroSection Component</div>,
}));

vi.mock('../../features/events/FiveEvents', () => ({
  default: () => <div data-testid="five-events">FiveEvents Component</div>,
}));

vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">FooterComponent</div>,
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Navbar component', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const navbar = screen.getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
    expect(navbar).toHaveTextContent('Navbar Component');
  });

  it('renders HeroSection component', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const heroSection = screen.getByTestId('hero-section');
    expect(heroSection).toBeInTheDocument();
    expect(heroSection).toHaveTextContent('HeroSection Component');
  });

  it('renders FiveEvents component', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const fiveEvents = screen.getByTestId('five-events');
    expect(fiveEvents).toBeInTheDocument();
    expect(fiveEvents).toHaveTextContent('FiveEvents Component');
  });

  it('renders FooterComponent', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const footer = screen.getByTestId('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('FooterComponent');
  });



  it('matches the snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  // Additional Test: Accessibility Check

});
