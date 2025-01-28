import { describe, it, expect } from 'vitest';
import moment from 'moment-jalaali';
import { parseDateTimeToJalali } from './dateParserToJalali';

describe('parseDateTimeToJalali', () => {
    it('should correctly parse a given UTC datetime string to Jalali format', () => {
        // تاریخ ورودی میلادی
        const dateTimeStr = '2025-01-28T15:00:00Z'; // 28th January 2025, 15:00 UTC
        
        // اجرای تابع
        const result = parseDateTimeToJalali(dateTimeStr);

        // انتظار خروجی جلالی
        const expectedDate = moment(dateTimeStr).utcOffset('+00:00');
        const expectedWeekDay = expectedDate.day(); // اندیس روز هفته
        const expectedPersianDate = expectedDate.jDate();
        const expectedPersianMonth = expectedDate.jMonth();
        const expectedPersianYear = expectedDate.jYear();
        const expectedTime = expectedDate.format('HH:mm');

        expect(result).toEqual({
            startWeekDay: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'][expectedWeekDay],
            startMonth: [
                'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
                'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
            ][expectedPersianMonth],
            startTime: expectedTime,
            startYear: expectedPersianYear.toString(),
            startDay: expectedPersianDate.toString(),
        });
    });

    it('should handle edge cases, such as leap years in Jalali calendar', () => {
        const leapYearDate = '2024-03-19T12:00:00Z'; // 19th March 2024, close to a Jalali leap year boundary

        const result = parseDateTimeToJalali(leapYearDate);

        expect(result.startYear).toBe('1402'); // جلالی سال کبیسه
        expect(result.startMonth).toBe('اسفند'); // ماه آخر
        expect(result.startDay).toBe('29'); // 29 اسفند
    });
});
