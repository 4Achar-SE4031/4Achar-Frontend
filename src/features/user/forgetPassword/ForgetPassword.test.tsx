import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgetPassword from "./ForgetPassword";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { toast } from 'react-toastify';
import axios from 'axios';
import SearchProvider from "../../Search/searchStatus";
import AuthProvider from "../login/authProvider";

// Mocking the axios request to prevent actual API calls
vi.mock('axios');

// Mocking the ToastContainer and toast methods
vi.mock('react-toastify', () => ({
  __esModule: true,
  ToastContainer: () => <div>Mocked ToastContainer</div>,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

test("renders ForgetPassword component correctly", () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <ForgetPassword />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  // Check if the heading is rendered
  expect(screen.getByText("بازیابی رمز عبور")).toBeInTheDocument();

  // Check if the email input is rendered
  const emailInput = screen.getByPlaceholderText("ایمیل");
  expect(emailInput).toBeInTheDocument();

  // Check if the submit button is rendered and enabled
  const submitButton = screen.getByText("ارسال ایمیل بازیابی");
  expect(submitButton).toBeInTheDocument();
  expect(submitButton).not.toBeDisabled();
});

test("displays validation message if invalid email is entered", () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <ForgetPassword />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  // Enter invalid email
  const emailInput = screen.getByPlaceholderText("ایمیل");
  fireEvent.change(emailInput, { target: { value: "invalid-email" } });

  // Click on the submit button
  const submitButton = screen.getByText("ارسال ایمیل بازیابی");
  fireEvent.click(submitButton);

  // Check if the validation message appears
  expect(screen.getByText("لطفا یک ایمیل معتبر وارد کنید")).toBeInTheDocument();
});

test("calls axios.post and shows success toast on valid email", async () => {
  // Mock the axios response for a successful API call
  axios.post.mockResolvedValue({
    data: { message: "Email sent successfully" },
  });

  render(
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <ForgetPassword />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  // Enter a valid email
  const emailInput = screen.getByPlaceholderText("ایمیل");
  fireEvent.change(emailInput, { target: { value: "valid@example.com" } });

  // Click on the submit button
  const submitButton = screen.getByText("ارسال ایمیل بازیابی");
  fireEvent.click(submitButton);

  // Wait for the toast success message to be called
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith("ایمیل بازیابی با موفقیت برای شما ارسال شد");
  });
});

test("shows error toast on failed API call", async () => {
    // Mock the axios response for a failed API call with the correct error structure
    axios.post.mockRejectedValue({
      response: {
        request: {
          responseText: "User not found!",
        },
      },
    });
  
    render(
      <BrowserRouter>
        <AuthProvider>
          <SearchProvider>
            <ForgetPassword />
          </SearchProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  
    // Enter a valid email
    const emailInput = screen.getByPlaceholderText("ایمیل");
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
  
    // Click on the submit button
    const submitButton = screen.getByText("ارسال ایمیل بازیابی");
    fireEvent.click(submitButton);
  
    // Wait for the toast error message to be called
    await waitFor(() => {
      // Check if the toast.error function was called with the expected error message
      expect(toast.error).toHaveBeenCalledWith("ایمیل معتبر نمی باشد");
    });
  });
  
  
