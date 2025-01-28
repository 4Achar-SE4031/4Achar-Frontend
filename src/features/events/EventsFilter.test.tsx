import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventsFilter from './EventsFilter';
import '@testing-library/jest-dom';

// Mock onFilterChange function
const mockOnFilterChange = vi.fn();

describe('EventsFilter Component', () => {
  let onFilterChangeMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onFilterChangeMock = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });
  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders all input fields', () => {
    render(<EventsFilter onFilterChange={mockOnFilterChange} />);

    // Check if all expected inputs are rendered
    expect(screen.getByLabelText('قیمت از (تومان)')).toBeInTheDocument();
    expect(screen.getByLabelText('قیمت تا (تومان)')).toBeInTheDocument();
    expect(screen.getByLabelText('استان')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('تاریخ شروع')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('تاریخ پایان')).toBeInTheDocument();
  });

  // it('updates price range on input change', async () => {
  //   render(<EventsFilter onFilterChange={mockOnFilterChange} />);
  //   const priceFromInput = screen.getByLabelText('قیمت از (تومان)');
  //   const priceToInput = screen.getByLabelText('قیمت تا (تومان)');

  //   await userEvent.type(priceFromInput, '1000');
  //   await userEvent.type(priceToInput, '5000');

  //   expect(priceFromInput.value).toBe('1000');
  //   expect(priceToInput.value).toBe('5000');

  //   // Since there's a debounce, we simulate passing of time for the debounce to kick in
  //   await new Promise(resolve => setTimeout(resolve, 2100)); // Wait longer than debounce time

  //   expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
  //     priceFrom: '1000',
  //     priceTo: '5000'
  //   }));
  // });

  // it('handles province selection', async () => {
  //   render(<EventsFilter onFilterChange={mockOnFilterChange} />);
  //   const provinceSelect = screen.getByLabelText('استان');
    
  //   // Assuming 'تهران' is one of the options
  //   await userEvent.selectOptions(provinceSelect, 'تهران');

  //   await new Promise(resolve => setTimeout(resolve, 2100)); // Wait for debounce

  //   expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
  //     province: 'تهران'
  //   }));
  // });

  // it('updates date range on date picker change', async () => {
  //   render(<EventsFilter onFilterChange={mockOnFilterChange} />);
  //   const startDatePicker = screen.getByTestId('start-date-picker');
  //   const endDatePicker = screen.getByTestId('end-date-picker');

  //   // This might need to be adjusted based on how DatePicker component handles input
  //   await userEvent.type(startDatePicker, '1402/07/13');
  //   await userEvent.type(endDatePicker, '1402/07/20');

  //   // Simulate some interaction to trigger change since exact behavior might vary
  //   fireEvent.change(startDatePicker, { target: { value: '1402/07/13' } });
  //   fireEvent.change(endDatePicker, { target: { value: '1402/07/20' } });

  //   await new Promise(resolve => setTimeout(resolve, 2100)); // Debounce wait

  //   expect(mockOnFilterChange).toHaveBeenCalledWith(expect.objectContaining({
  //     dateRange: ['2023-10-05', '2023-10-12']  // Converted from Shamsi to Gregorian
  //   }));
  // });
  
  it('does not call onFilterChange if filter values remain unchanged', async () => {
      render(<EventsFilter onFilterChange={onFilterChangeMock} />);
      const priceFromInput = screen.getByLabelText('قیمت از (تومان)') as HTMLInputElement;

      // Change to '1000'
      fireEvent.change(priceFromInput, { target: { value: '1000' } });
      vi.advanceTimersByTime(2000);

      // Should have called once
      expect(onFilterChangeMock).toHaveBeenCalledTimes(1);

      // Try changing to '1000' again => no actual change
      fireEvent.change(priceFromInput, { target: { value: '1000' } });
      vi.advanceTimersByTime(2000);

      // Should still be 1
      expect(onFilterChangeMock).toHaveBeenCalledTimes(1);
    },
    5000
  );


  // Add more tests as needed for other interactions or edge cases
});