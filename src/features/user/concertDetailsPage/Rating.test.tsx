import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HoverRating from './Rating';

describe('HoverRating Component', () => {
    it('renders the Rating component with default value', () => {
        render(<HoverRating />);

        // بررسی اینکه رتبه‌بندی پیش‌فرض برابر با ۳ است
        const ratingElement = screen.getByRole('radio', { name: /3 Stars, متوسط/i });
        expect(ratingElement).toBeInTheDocument();

        // بررسی اینکه برچسب پیش‌فرض "متوسط" باشد
        const labelElement = screen.getByText('متوسط');
        expect(labelElement).toBeInTheDocument();
    });

    it('changes the value on user interaction', () => {
        render(<HoverRating />);

        // بررسی اینکه امتیاز اولیه برابر با ۳ است
        const ratingElement = screen.getByRole('radio', { name: /3 Stars, متوسط/i });
        expect(ratingElement).toBeInTheDocument();

        // تغییر امتیاز به ۵
        const starElements = screen.getAllByRole('radio');
        fireEvent.click(starElements[4]); // کلیک روی ستاره پنجم

        // بررسی اینکه مقدار تغییر کرده و به ۵ رسیده است
        const updatedLabel = screen.getByText('عالی');
        expect(updatedLabel).toBeInTheDocument();
    });

    
});
