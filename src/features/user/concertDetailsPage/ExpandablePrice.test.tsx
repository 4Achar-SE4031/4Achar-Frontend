import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ExpandablePrice from './ExpandablePrice';

describe('ExpandablePrice', () => {
  it('renders the initial price correctly', () => {
    render(<ExpandablePrice prices={[1000000]} />);
    
    const priceText = screen.getByText(/از 1,000,000 تومان/);
    expect(priceText).toBeInTheDocument();
  });

  it('toggles the expanded state when clicked', () => {
    render(<ExpandablePrice prices={[700000, 850000, 1000000]} />);

    const trigger = screen.getByText(/از 700,000 تومان/);
    fireEvent.click(trigger);

    const popover = screen.getByText(/850,000 تومان/);
    expect(popover).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(popover).not.toBeInTheDocument();
  });

  it('closes the popover when clicked outside', () => {
    render(<ExpandablePrice prices={[700000, 850000, 1000000]} />);
    
    const trigger = screen.getByText(/از 700,000 تومان/);
    fireEvent.click(trigger);
    expect(screen.getByText(/850,000 تومان/)).toBeInTheDocument();

    fireEvent.mouseDown(document);
    expect(screen.queryByText(/850,000 تومان/)).not.toBeInTheDocument();
  });

  it('shows correct prices in the popover when expanded', () => {
    render(<ExpandablePrice prices={[700000, 850000, 1000000]} />);
  
    const trigger = screen.getByText(/از 700,000 تومان/);
    fireEvent.click(trigger);
  
    // Check that the first price in the popover is correct
    const firstPrice = screen.getByText('700,000 تومان');
    expect(firstPrice).toBeInTheDocument();
  });
  
  
  
  

  it('should position the popover correctly when expanded', () => {
    const { container } = render(<ExpandablePrice prices={[700000, 850000, 1000000]} />);
    
    const trigger = screen.getByText(/از 700,000 تومان/);
    fireEvent.click(trigger);

    const popover = container.querySelector('div[style*="position: absolute"]');
    expect(popover).toBeTruthy();
    expect(popover?.style.top).toBe('100%');
  });
});
