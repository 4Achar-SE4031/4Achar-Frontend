// Pagination.test.tsx
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Helper function to convert numbers to Persian digits.
   * This mirrors the `toPersianDigits` function in the component.
   */
  const toPersianDigits = (num: number): string => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return num
      .toString()
      .replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
  };

  
  it('calls onChange with the correct page number when a page button is clicked', () => {
    const count = 5;
    const currentPage = 2;
    const onChange = vi.fn();

    render(<Pagination count={count} page={currentPage} onChange={onChange} />);

    const targetPage = 4;
    const targetButton = screen.getByTestId(`pagination-button-${targetPage}`);
    fireEvent.click(targetButton);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object), targetPage);
  });

  it('calls onChange with the correct value when next button is clicked', () => {
    const count = 5;
    const currentPage = 3;
    const onChange = vi.fn();

    render(<Pagination count={count} page={currentPage} onChange={onChange} />);

    const nextButton = screen.getByTestId('pagination-button-next');
    fireEvent.click(nextButton);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(expect.any(Object), currentPage + 1);
  });

  

  



  it('does not render first and last buttons when count is small', () => {
    const count = 4;
    const currentPage = 2;
    const onChange = vi.fn();

    render(<Pagination count={count} page={currentPage} onChange={onChange} />);

    // Depending on your implementation, first and last buttons might not be rendered
    // Adjust the assertions accordingly
    const firstButton = screen.queryByTestId('pagination-button-first');
    const lastButton = screen.queryByTestId('pagination-button-last');

    expect(firstButton).not.toBeInTheDocument();
    expect(lastButton).not.toBeInTheDocument();
  });


  it('matches the snapshot', () => {
    const count = 5;
    const currentPage = 3;
    const onChange = vi.fn();

    const { asFragment } = render(<Pagination count={count} page={currentPage} onChange={onChange} />);
    expect(asFragment()).toMatchSnapshot();
  });

  /**
   * Accessibility Test
   */


  /**
   * Test to ensure that Persian digits are correctly displayed
   */
  it('displays page numbers in Persian digits', () => {
    const count = 3;
    const currentPage = 2;
    const onChange = vi.fn();

    render(<Pagination count={count} page={currentPage} onChange={onChange} />);

    for (let i = 1; i <= count; i++) {
      const persianDigit = toPersianDigits(i);
      const pageButton = screen.getByTestId(`pagination-button-${i}`);
      expect(pageButton).toHaveTextContent(persianDigit);
    }
  });
});
