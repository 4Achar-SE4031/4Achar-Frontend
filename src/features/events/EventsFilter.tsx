import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

// برای تبدیل شمسی به میلادی در زمان ارسال به سرور
import moment from "moment-jalaali";

interface EventsFilterProps {
  onFilterChange: (filters: any) => void;
}

const provinces = [
  "تهران",
  "گیلان",
  "آذربایجان شرقی",
  "خوزستان",
  "فارس",
  "اصفهان",
  "خراسان رضوی",
  "قزوین",
  "سمنان",
  "قم",
  "مرکزی",
  "زنجان",
  "مازندران",
  "گلستان",
  "اردبیل",
  "آذربایجان غربی",
  "همدان",
  "کردستان",
  "کرمانشاه",
  "لرستان",
  "بوشهر",
  "کرمان",
  "هرمزگان",
  "چهارمحال و بختیاری",
  "یزد",
  "سیستان و بلوچستان",
  "ایلام",
  "کهگلویه و بویراحمد",
  "خراسان شمالی",
  "خراسان جنوبی",
  "البرز",
];

const EventsFilter: React.FC<EventsFilterProps> = ({ onFilterChange }) => {
  // استیت فیلترها: [startShamsi, endShamsi] = ["۱۴۰۲/۷/۱۳", "۱۴۰۲/۷/۲۰"] (مثال)
  const [filters, setFilters] = useState({
    priceFrom: "",
    priceTo: "",
    province: "",
    category: "",
    sortType: "",
    dateRange: [null, null] as (string | null)[],
  });

  // Debouncer
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  //    تابع مشترک برای اعمال فیلترها و تبدیل تاریخ برای سرور (میلادی)
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  const handleInputChange = (field: string, value: any) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);

    // تبدیل تاریخ شمسی به میلادی قبل از ارسال
    const [startShamsi, endShamsi] = updatedFilters.dateRange;
    let startMiladi = null;
    let endMiladi = null;

    if (startShamsi) {
      // لحظه‌ای که می‌خواهیم به سرور بفرستیم:
      startMiladi = moment(startShamsi, "jYYYY/jM/jD").format("YYYY-MM-DD");
    }
    if (endShamsi) {
      endMiladi = moment(endShamsi, "jYYYY/jM/jD").format("YYYY-MM-DD");
    }

    const finalFiltersForServer = {
      ...updatedFilters,
      dateRange: [startMiladi, endMiladi],
    };

    // Debounce
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      onFilterChange(finalFiltersForServer);
    }, 2000);
    setDebounceTimer(timer);
  };

  // اعداد فارسی در react-multi-date-picker
  const digits = persian_fa.digits; // ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"]
  // اگر قصد داشتید ورودی کاربر را از "۲۳" به "23" ببرید، از الگوهای زیر هم استفاده کنید
  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  //    تبدیل مقدار استیت به DateObject برای نمایش در فیلد DatePicker
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  const getDateObject = (shamsiStr: string | null) => {
    if (!shamsiStr) return null;
    // کتابخانه date-object با فرمت "YYYY/M/D" و calendar={persian} می‌تواند parse کند
    // اگر در استیت ما بین سال/ماه/روز dash بود، حتماً اینجا replace می‌کنیم تا بشود "/"
    const replaced = shamsiStr.replace(/-/g, "/");
    return new DateObject({
      date: replaced,
      format: "YYYY/M/D", // با توجه به این که calendar را Persian گذاشته‌ایم، این یعنی تاریخ شمسی
      calendar: persian,
      locale: persian_fa,
    });
  };

  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  //    هندل تاریخ شروع (انتخاب از تقویم یا تایپ دستی)
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  const handleStartDateChange = (
    newDate: DateObject | null,
    { input, isTyping }: { input: { value: string }; isTyping: boolean }
  ) => {
    if (!isTyping) {
      // کاربر تاریخ را با کلیک روی تقویم انتخاب کرده
      if (newDate) {
        // رشته‌ی شمسی به شکل "۱۴۰۲/۷/۱۳"
        let dateStr = newDate.format("YYYY/M/D");
        // اگر خواستید ارقام فارسی را به انگلیسی تبدیل کنید (اختیاری):
        for (let i = 0; i < persianNumbers.length; i++) {
          dateStr = dateStr.replace(persianNumbers[i], arabicNumbers[i]);
        }
        handleInputChange("dateRange", [dateStr, filters.dateRange[1]]);
      } else {
        // انتخاب تاریخ حذف شد
        handleInputChange("dateRange", [null, filters.dateRange[1]]);
      }
    } else {
      // کاربر در حال تایپ کردن دستی است
      let value = input.value;
      // اگر قصد داریم ارقام فارسی وارد شده را به انگلیسی تبدیل کنیم:
      for (let digit of digits) {
        value = value.replace(new RegExp(digit, "g"), digits.indexOf(digit).toString());
      }
      // حالا باید صحت year/month/day را بسنجیم
      const parts = value.split("/");
      const numbers = parts.map(Number);
      const [year, month, day] = numbers;

      // اعتبارسنجی ساده:
      if (input.value && numbers.some((num) => isNaN(num))) return false;
      if (month > 12 || month < 1) return false;
      if (day < 1 || day > 31) return false;
      if (parts.some((val) => val.startsWith("00"))) return false;

      handleInputChange("dateRange", [value, filters.dateRange[1]]);
    }
  };

  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  //    هندل تاریخ پایان (انتخاب از تقویم یا تایپ دستی)
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  const handleEndDateChange = (
    newDate: DateObject | null,
    { input, isTyping }: { input: { value: string }; isTyping: boolean }
  ) => {
    if (!isTyping) {
      if (newDate) {
        let dateStr = newDate.format("YYYY/M/D");
        for (let i = 0; i < persianNumbers.length; i++) {
          dateStr = dateStr.replace(persianNumbers[i], arabicNumbers[i]);
        }
        handleInputChange("dateRange", [filters.dateRange[0], dateStr]);
      } else {
        handleInputChange("dateRange", [filters.dateRange[0], null]);
      }
    } else {
      // تایپ دستی
      let value = input.value;
      for (let digit of digits) {
        value = value.replace(new RegExp(digit, "g"), digits.indexOf(digit).toString());
      }
      const parts = value.split("/");
      const numbers = parts.map(Number);
      const [year, month, day] = numbers;

      if (input.value && numbers.some((num) => isNaN(num))) return false;
      if (month > 12 || month < 1) return false;
      if (day < 1 || day > 31) return false;
      if (parts.some((val) => val.startsWith("00"))) return false;

      handleInputChange("dateRange", [filters.dateRange[0], value]);
    }
  };

  return (
    <Box
      sx={{
        padding: "16px",
        background: "#333540",
        borderRadius: "8px",
        marginBottom: "16px",
        color: "#ffeba7",
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
      className="events-filter"
      lang="fa"
    >
      <Typography variant="h6" gutterBottom>
        فیلتر رویدادها
      </Typography>

      <Box
        sx={{
          display: "inline-flex",
          gap: "16px",
        }}
      >
        {/* قیمت از */}
        <TextField
          label="قیمت از (تومان)"
          variant="outlined"
          type="number"
          value={filters.priceFrom}
          onChange={(e) => handleInputChange("priceFrom", e.target.value)}
          sx={{
            flex: "1",
            minWidth: "150px",
            "& .MuiOutlinedInput-root": {
              borderColor: "#1976d2",
              color: "#1976d2",
              backgroundColor: "#fff",
              direction: "rtl",
            },
          }}
        />

        {/* قیمت تا */}
        <TextField
          label="قیمت تا (تومان)"
          variant="outlined"
          type="number"
          value={filters.priceTo}
          onChange={(e) => handleInputChange("priceTo", e.target.value)}
          sx={{
            flex: "1",
            minWidth: "150px",
            "& .MuiOutlinedInput-root": {
              borderColor: "#1976d2",
              color: "#1976d2",
              backgroundColor: "#fff",
              direction: "rtl",
            },
          }}
        />

        {/* استان */}
        <TextField
          label="استان"
          variant="outlined"
          value={filters.province}
          onChange={(e) => handleInputChange("province", e.target.value)}
          select
          sx={{
            flex: "1",
            "& .MuiOutlinedInput-root": {
              borderColor: "#ffeba7",
              color: "#ffeba7",
              backgroundColor: "#fff",
              direction: "rtl",
            },
          }}
        >
          <MenuItem value="">همه استان‌ها</MenuItem>
          {provinces.map((province, index) => (
            <MenuItem key={index} value={province}>
              {province}
            </MenuItem>
          ))}
        </TextField>

        {/* مرتب‌سازی */}
        <TextField
          label="مرتب‌سازی"
          variant="outlined"
          value={filters.sortType}
          onChange={(e) => handleInputChange("sortType", e.target.value)}
          select
          sx={{
            flex: "1",
            "& .MuiOutlinedInput-root": {
              borderColor: "#1976d2",
              color: "#1976d2",
              backgroundColor: "#fff",
              direction: "rtl",
            },
          }}
        >
          <MenuItem value="">بدون مرتب‌سازی</MenuItem>
          <MenuItem value="popular">محبوب‌ترین</MenuItem>
          <MenuItem value="recent">جدیدترین</MenuItem>
          <MenuItem value="cheap">ارزان‌ترین</MenuItem>
          <MenuItem value="expensive">گران‌ترین</MenuItem>
        </TextField>

        {/* تاریخ شروع و پایان به صورت شمسی در UI */}
        <Box display="flex" gap="8px" flex="1">
          <DatePicker
            value={getDateObject(filters.dateRange[0])} // تبدیل استرینگ به DateObject
            onChange={handleStartDateChange}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/M/D" // نمایش شمسی بدون صفر
            placeholder="تاریخ شروع"
            style={{
              color: "#1976d2",
              backgroundColor: "#fff",
              borderColor: "#1976d2",
              direction: "rtl",
              width: "100%",
              height: "55px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          />

          <DatePicker
            value={getDateObject(filters.dateRange[1])}
            onChange={handleEndDateChange}
            calendar={persian}
            locale={persian_fa}
            format="YYYY/M/D"
            placeholder="تاریخ پایان"
            style={{
              color: "#1976d2",
              backgroundColor: "#fff",
              borderColor: "#1976d2",
              direction: "rtl",
              width: "100%",
              height: "55px",
              borderRadius: "5px",
              textAlign: "center",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default EventsFilter;
