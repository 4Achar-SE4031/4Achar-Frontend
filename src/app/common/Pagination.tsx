import React from "react";
import { Pagination as MuiPagination, PaginationItem } from "@mui/material";

const Pagination: React.FC<{
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}> = ({ count, page, onChange }) => {
  const toPersianDigits = (num: number): string => {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    return num
      .toString()
      .replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
  };

  return (
    <MuiPagination
      count={count}
      page={page}
      onChange={onChange}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          // Convert page numbers to Persian if the item type is 'page'
          page={item.page !== null ? toPersianDigits(item.page) : undefined}
        />
      )}
    />
  );
};

export default Pagination;
