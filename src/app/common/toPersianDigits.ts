const toPersianDigits = (num: string | number): string => {
  if (num == null) return "";
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return num
    .toString()
    .replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

export default toPersianDigits;