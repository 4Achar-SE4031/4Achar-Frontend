import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HoverRating from './Rating'; // Adjust the import path

describe('HoverRating Component', () => {
  it('renders with default value 3 and displays متوسط', () => {
    render(<HoverRating />);
    
    // Check initial label
    expect(screen.getByText('متوسط')).toBeInTheDocument();
    
    // Verify third star is checked
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(radios[2].checked).toBe(true);
  });

  it('changes value and label when star is clicked', () => {
    render(<HoverRating />);

    // Click fifth star
    const fifthStar = screen.getByRole('radio', { name: /5 Stars, عالی/ });
    fireEvent.click(fifthStar);
    
    // Verify new value and label
    expect(screen.getByText('عالی')).toBeInTheDocument();
    expect(fifthStar).toBeChecked();
  });

  it('clears rating when clicking current star again', () => {
    render(<HoverRating />);

    // Click third star (initial value)
    const thirdStar = screen.getByRole('radio', { name: /3 Stars, متوسط/ });
    fireEvent.click(thirdStar);
    
    // Verify label disappears and rating is cleared
    expect(screen.queryByText('متوسط')).toBeInTheDocument();
    expect(thirdStar).toBeChecked();
  });

  it('has correct aria-labels for all stars', () => {
    render(<HoverRating />);

    const testLabels = [
      '1 Star, خیلی ضعیف',
      '2 Stars, ضعیف',
      '3 Stars, متوسط',
      '4 Stars, خوب',
      '5 Stars, عالی'
    ];

    testLabels.forEach(label => {
      expect(screen.getByRole('radio', { name: label })).toBeInTheDocument();
    });
  });
});