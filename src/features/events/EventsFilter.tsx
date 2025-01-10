import React, { useState } from "react";
import {
  Box,
  TextField,
  Slider,
  MenuItem,
  Typography,
} from "@mui/material";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/red.css";

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
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    city: "",
    category: "",
    sortType: "",
    dateRange: [null, null], // Shamsi dates will be handled here
  });

  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleInputChange = (field: string, value: any) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);

    // Debouncer: apply filters after 2 seconds of inactivity
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      onFilterChange(updatedFilters);
    }, 2000);
    setDebounceTimer(timer);
  };
  const formatPriceLabel = (value: number) => {
    if (value < 1000) {
      return `${value} هزار تومان`;
    } else {
      const millionValue = (value / 1000).toFixed(1);
      return `${millionValue} میلیون تومان`;
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
        overflowX: "auto", // Enable horizontal scroll
        whiteSpace: "nowrap", // Prevent wrapping of child elements
      }}
      className="events-filter"
      lang="fa"
    >
      <Typography variant="h6" gutterBottom>
        فیلتر رویدادها
      </Typography>

      <Box
        sx={{
          display: "inline-flex", // Keep items in a row
          gap: "16px",
        }}>
        {/* Price Range */}
        <Box flex="1">
          <Typography>محدوده قیمت (تومان)</Typography>
          <Slider
            value={filters.priceRange}
            onChange={(e, value) => handleInputChange("priceRange", value)}
            valueLabelDisplay="auto"
            valueLabelFormat={formatPriceLabel}
            min={0}
            max={10000}
            sx={{ color: "#1976d2" }}
          />
        </Box>

        {/* City */}
        <TextField
          label="استان"
          variant="outlined"
          value={filters.city}
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

        {/* Category
        <TextField
          label="دسته‌بندی"
          variant="outlined"
          value={filters.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
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
          <MenuItem value="">همه دسته‌بندی‌ها</MenuItem>
          <MenuItem value="کنسرت">کنسرت</MenuItem>
          <MenuItem value="تئاتر">تئاتر</MenuItem>
        </TextField> */}

        {/* Sort Type */}
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

        {/* Date Range with Shamsi Dates */}
        <Box display="flex" gap="8px" flex="1">
          <DatePicker
            value={filters.dateRange[0]}
            onChange={(value) =>
              handleInputChange("dateRange", [
                value instanceof DateObject ? value : null,
                filters.dateRange[1],
              ])
            }
            calendar={persian}
            locale={persian_fa}
            placeholder="تاریخ شروع"
            inputClass="custom-date-input"
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
            value={filters.dateRange[1]}
            onChange={(value) =>
              handleInputChange("dateRange", [
                filters.dateRange[0],
                value instanceof DateObject ? value : null,
              ])
            }
            calendar={persian}
            locale={persian_fa}
            placeholder="تاریخ پایان"
            inputClass="custom-date-input"
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