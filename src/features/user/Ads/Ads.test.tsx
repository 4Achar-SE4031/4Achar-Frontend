import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdvertisementCard from './Ads';
import '@testing-library/jest-dom';

describe('AdvertisementCard', () => {
  // Test default props
  it('renders with default props', () => {
    render(<AdvertisementCard />);
    
    // Check if default title is rendered
    expect(screen.getByText('Experience Innovation')).toBeInTheDocument();
    
    // Check if default link text is rendered
    expect(screen.getByText('Learn More')).toBeInTheDocument();
    
    // Check if the image is rendered with default src
    const image = screen.getByAltText('Advertisement') as HTMLImageElement;
    expect(image.src).toContain('/api/placeholder/800/400');
  });

  // Test custom props
  it('renders with custom props', () => {
    const customProps = {
      title: 'Custom Title',
      description: 'Custom Description',
      linkText: 'Click Here',
      linkUrl: 'https://example.com',
      imageUrl: '/custom-image.jpg',
      height: '500px',
      class_name: 'custom-class'
    };

    render(<AdvertisementCard {...customProps} />);
    
    // Check if custom title is rendered
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    
    // Check if custom link text is rendered
    expect(screen.getByText('Click Here')).toBeInTheDocument();
    
    // Check if custom image source is set
    const image = screen.getByAltText('Advertisement') as HTMLImageElement;
    expect(image.src).toContain('/custom-image.jpg');
    
    // Check if custom class is applied
    const container = screen.getByText('Custom Title').closest('.custom-class');
    expect(container).toBeInTheDocument();
  });

  // Test link properties
  it('renders link with correct properties', () => {
    const linkUrl = 'https://example.com';
    render(<AdvertisementCard linkUrl={linkUrl} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', linkUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('dir', 'rtl');
  });

  // Test responsive layout
  it('applies correct height when provided', () => {
    const customHeight = '600px';
    render(<AdvertisementCard height={customHeight} />);
    
    const card = screen.getByText('Experience Innovation').closest('.ad-card');
    expect(card).toHaveStyle({ height: customHeight });
  });

  // Test CSS classes
  it('applies correct CSS classes', () => {
    render(<AdvertisementCard />);
    
    // Check if the card has the correct base classes
    const card = screen.getByText('Experience Innovation').closest('.ad-card');
    expect(card).toHaveClass('group', 'relative', 'overflow-hidden', 'rounded-xl');
    
    // Check if the image container has the correct classes
    const imageContainer = screen.getByAltText('Advertisement').parentElement;
    expect(imageContainer).toHaveClass('relative', 'h-96', 'overflow-hidden');
  });

  // Test image rendering
  it('renders image with correct attributes', () => {
    const imageUrl = '/custom-image.jpg';
    render(<AdvertisementCard imageUrl={imageUrl} />);
    
    const image = screen.getByAltText('Advertisement');
    expect(image).toHaveClass('ad-image', 'h-full', 'w-full', 'object-cover');
    expect(image).toHaveAttribute('src', imageUrl);
  });

  // Test empty/undefined props handling
  it('handles undefined props gracefully', () => {
    render(<AdvertisementCard title={undefined} description={undefined} />);
    
    // Should render with default values
    expect(screen.getByText('Experience Innovation')).toBeInTheDocument();
  });
});