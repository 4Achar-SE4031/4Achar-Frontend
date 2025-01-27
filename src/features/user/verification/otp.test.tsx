import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OTPInput from "./otp";
import React from "react";
import { vi } from 'vitest';

describe("OTPInput Component", () => {
  it("should render correct number of input fields", () => {
    const mockOtp = ["", "", "", ""];
    const setOtp = vi.fn();
    
    render(<OTPInput otp={mockOtp} setOtp={setOtp} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(mockOtp.length);
  });

  it("should update the input value on user input", async () => {
    const mockOtp = ["", "", "", ""];
    const setOtp = vi.fn();
    
    render(<OTPInput otp={mockOtp} setOtp={setOtp} />);
    
    const firstInput = screen.getAllByRole("textbox")[0]; // انتخاب اولین ورودی
  
    await userEvent.type(firstInput, "5");
  
    expect(setOtp).toHaveBeenCalledWith(["5", "", "", ""]);
  });
  

  it("should move focus to the next input on valid input", async () => {
    const mockOtp = ["", "", "", ""];
    const setOtp = vi.fn() ;

    render(<OTPInput otp={mockOtp} setOtp={setOtp} />);

    const inputs = screen.getAllByRole("textbox");

    await userEvent.type(inputs[0], "1");
    expect(document.activeElement).toBe(inputs[1]);
  });

  it("should move focus to the previous input on backspace", async () => {
    const mockOtp = ["1", "", "", ""];
    const setOtp = vi.fn();

    render(<OTPInput otp={mockOtp} setOtp={setOtp} />);
    
    const inputs = screen.getAllByRole("textbox");

    await userEvent.click(inputs[1]);
    await userEvent.keyboard("{Backspace}");

    expect(document.activeElement).toBe(inputs[0]);
  });

  it("should not accept non-numeric input", async () => {
    const mockOtp = ["", "", "", ""];
    const setOtp = vi.fn();

    render(<OTPInput otp={mockOtp} setOtp={setOtp} />);

    const firstInput = screen.getAllByRole("textbox")[0];

    await userEvent.type(firstInput, "a");

    expect(setOtp).not.toHaveBeenCalled();
  });

//   it("should not allow more than one character in input", async () => {
//     const mockOtp = ["", "", "", ""];
//     const setOtp = vi.fn();
  
//     render(<OTPInput otp={mockOtp} setOtp={setOtp} />);
  
//     const firstInput = screen.getAllByRole("textbox")[0];
  
//     await userEvent.type(firstInput, "12");
  
//     expect(setOtp).toHaveBeenCalledWith(["2", "", "", ""]);
//   });
  
//   it("should change border color when input is focused and blurred", async () => {
//     const mockOtp = ["", "", "", ""];
//     const setOtp = vi.fn();
  
//     render(<OTPInput otp={mockOtp} setOtp={setOtp} />);
//     const firstInput = screen.getAllByRole("textbox")[0];
  
//     await userEvent.click(firstInput);
//     expect(firstInput).toHaveStyle("border-color: orange");
  
//     firstInput.blur();
//     expect(firstInput).toHaveStyle("border-color: yellow");
//   });
  
});
