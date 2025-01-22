import moment from 'moment-jalaali';

interface EventDateTime {
    startWeekDay: string;
    startMonth: string;
    startTime: string;
    startYear: string;
    startDay: string;
}

const persianWeekDays = [
    'شنبه',
    'یکشنبه',
    'دوشنبه',
    'سه‌شنبه',
    'چهارشنبه',
    'پنج‌شنبه',
    'جمعه'
];

const persianMonths = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند'
];

export const parseDateTimeToJalali = (dateTimeStr: string): EventDateTime => {
    // Initialize moment with the UTC date
    const m = moment(dateTimeStr);
    
    // Convert to Tehran timezone
    m.utcOffset('+00:00');
    
    // Get Persian date components
    const weekDayIndex = m.day();
    const persianDate = m.jDate();
    const persianMonth = m.jMonth();
    const persianYear = m.jYear();
    
    // Format time in HH:mm
    const time = m.format('HH:mm');
    
    return {
        startWeekDay: persianWeekDays[weekDayIndex],
        startMonth: persianMonths[persianMonth],
        startTime: time,
        startYear: persianYear.toString(),
        startDay: persianDate.toString(),
    };
};