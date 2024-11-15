import React, { useState } from "react";

interface OTPInputProps {
  otp: string[]; 
  setOtp: React.Dispatch<React.SetStateAction<string[]>>; // نوع setter برای state
}

const OTPInput: React.FC<OTPInputProps> = ({ otp, setOtp }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleChange = (value: string, index: number) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div dir="ltr" style={{ display: "flex", justifyContent: "center" }}>
      {otp.map((value, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          className="otp-input"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={() => setActiveIndex(index)} 
          onBlur={() => setActiveIndex(null)}
          style={{
            width: "40px",
            height: "40px",
            margin: "5px",
            textAlign: "center",
            fontSize: "18px",
            border: "2px solid",
            borderColor: activeIndex === index ? "orange" : "yellow", 
            borderRadius: "4px",
            direction: "ltr",
            outline: "none",
          }}
        />
      ))}
    </div>
  );
};

export default OTPInput;
