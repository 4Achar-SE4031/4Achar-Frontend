// src/app/layout/Footer.test.tsx

import { render, screen } from '@testing-library/react';
import FooterComponent from './Footer';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mocking react-icons to prevent rendering actual SVGs during tests
vi.mock('react-icons/fa', () => ({
  FaFacebookF: () => <div data-testid="icon-facebook" />,
  FaTwitter: () => <div data-testid="icon-twitter" />,
  FaInstagram: () => <div data-testid="icon-instagram" />,
  FaLinkedinIn: () => <div data-testid="icon-linkedin" />,
}));

describe('FooterComponent', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.resetAllMocks();
  });

  it('renders the footer correctly', () => {
    render(
      <BrowserRouter>
        <FooterComponent />
      </BrowserRouter>
    );

    // Check for the main footer sections
    const titleElement = screen.queryByText('کنسرتیفای');
    expect(titleElement).not.toBeNull();

    const logoElement = screen.queryByAltText('Concertify Logo');
    expect(logoElement).not.toBeNull();

    const popularCategories = screen.queryByText('دسته‌بندی‌های محبوب');
    expect(popularCategories).not.toBeNull();

    const importantLinks = screen.queryByText('لینک‌های مهم');
    expect(importantLinks).not.toBeNull();

    // Check for list items in "دسته‌بندی‌های محبوب"
    expect(screen.queryByText('کنسرت‌های موسیقی')).not.toBeNull();
    expect(screen.queryByText('تئاترها')).not.toBeNull();
    expect(screen.queryByText('فیلم‌ها')).not.toBeNull();
    expect(screen.queryByText('همایش‌ها')).not.toBeNull();
    expect(screen.queryByText('کارگاه‌های آموزشی')).not.toBeNull();

    // Check for list items in "لینک‌های مهم"
    expect(screen.queryByText('درباره ما')).not.toBeNull();
    expect(screen.queryByText('تماس با ما')).not.toBeNull();
    expect(screen.queryByText('پرسش‌های متداول')).not.toBeNull();
    expect(screen.queryByText('آخرین پست‌ها')).not.toBeNull();

    // Check for social media icons (mocked)
    expect(screen.queryByTestId('icon-facebook')).not.toBeNull();
    expect(screen.queryByTestId('icon-twitter')).not.toBeNull();
    expect(screen.queryByTestId('icon-instagram')).not.toBeNull();
    expect(screen.queryByTestId('icon-linkedin')).not.toBeNull();

    // Check for the footer bottom text
    const copyright =
      screen.queryByText('© ۲۰۲۴ کنسرتیفای. کلیه حقوق محفوظ است.');
    expect(copyright).not.toBeNull();
  });

  it('has a link to /events/recent in "آخرین پست‌ها"', () => {
    render(
      <BrowserRouter>
        <FooterComponent />
      </BrowserRouter>
    );

    const lastPostElement = screen.queryByText('آخرین پست‌ها');
    expect(lastPostElement).not.toBeNull();

    const lastPostLink = lastPostElement?.closest('a');
    expect(lastPostLink).not.toBeNull();

    if (lastPostLink) {
      const href = lastPostLink.getAttribute('href');
      expect(href).toBe('/events/recent');

      // To check the style, access the `style` property
      const color = lastPostLink.style.color;
      // Note: Inline styles in React are represented as camelCase in JS
      // and are reflected as their computed styles in tests.
      // However, the exact format (e.g., rgb vs hex) might vary.
      // Therefore, it's safer to check for inclusion or approximate values.
      expect(color).toBe('rgb(255, 235, 167)'); // #ffeba7 in RGB
    }
  });

  it('has all social media icons wrapped with correct links', () => {
    render(
      <BrowserRouter>
        <FooterComponent />
      </BrowserRouter>
    );

    // Check for Facebook link
    const facebookLink = screen.queryByLabelText('Facebook');
    expect(facebookLink).not.toBeNull();
    if (facebookLink) {
      expect(facebookLink.getAttribute('href')).toBe('https://www.facebook.com');
      expect(facebookLink.getAttribute('target')).toBe('_blank');
      expect(facebookLink.getAttribute('rel')).toBe('noopener noreferrer');
    }

    // Check for Twitter link
    const twitterLink = screen.queryByLabelText('Twitter');
    expect(twitterLink).not.toBeNull();
    if (twitterLink) {
      expect(twitterLink.getAttribute('href')).toBe('https://www.twitter.com');
      expect(twitterLink.getAttribute('target')).toBe('_blank');
      expect(twitterLink.getAttribute('rel')).toBe('noopener noreferrer');
    }

    // Check for Instagram link
    const instagramLink = screen.queryByLabelText('Instagram');
    expect(instagramLink).not.toBeNull();
    if (instagramLink) {
      expect(instagramLink.getAttribute('href')).toBe('https://www.instagram.com');
      expect(instagramLink.getAttribute('target')).toBe('_blank');
      expect(instagramLink.getAttribute('rel')).toBe('noopener noreferrer');
    }

    // Check for LinkedIn link
    const linkedinLink = screen.queryByLabelText('LinkedIn');
    expect(linkedinLink).not.toBeNull();
    if (linkedinLink) {
      expect(linkedinLink.getAttribute('href')).toBe('https://www.linkedin.com');
      expect(linkedinLink.getAttribute('target')).toBe('_blank');
      expect(linkedinLink.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('displays the correct copyright text', () => {
    render(
      <BrowserRouter>
        <FooterComponent />
      </BrowserRouter>
    );

    const copyright =
      screen.queryByText('© ۲۰۲۴ کنسرتیفای. کلیه حقوق محفوظ است.');
    expect(copyright).not.toBeNull();
  });
});
