import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ResetPassword from "./ResetPassword";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import  AuthProvider  from "../login/authProvider";

// Mocking the axios post request
vi.mock('axios');

// Mocking toast functions
vi.mock('react-toastify', () => ({
  __esModule: true,
  ToastContainer: () => <div>Mocked ToastContainer</div>,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("ResetPassword component", () => {
  test("renders ResetPassword component correctly", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ResetPassword />
        </AuthProvider>
      </BrowserRouter>
    );

    // Check if the heading is rendered
    expect(screen.getByText("تغییر رمز عبور")).toBeInTheDocument();

    // Check if password fields are rendered
    expect(screen.getByPlaceholderText("رمز‌ عبور جدید")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("تکرار رمز عبور جدید")).toBeInTheDocument();

    // Check if the submit button is rendered
    const submitButton = screen.getByText("تایید");
    expect(submitButton).toBeInTheDocument();
  });

  test("displays validation message if passwords don't match", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <ResetPassword />
        </AuthProvider>
      </BrowserRouter>
    );

    // Enter a password in the first field
    fireEvent.change(screen.getByPlaceholderText("رمز‌ عبور جدید"), { target: { value: "ValidPass123!" } });
    
    // Enter a different password in the second field
    fireEvent.change(screen.getByPlaceholderText("تکرار رمز عبور جدید"), { target: { value: "DifferentPass123!" } });

    // Click on submit button
    fireEvent.click(screen.getByText("تایید"));

    // Check if the validation message for matching passwords is shown
    expect(screen.getByText("رمزعبور و تکرار آن باید یکسان باشند")).toBeInTheDocument();
  });

  test("calls axios.post and shows success toast on valid password reset", async () => {
    // Mock the axios response for a successful API call
    axios.post.mockResolvedValue({
      data: { message: "Password reset successful" },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ResetPassword />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill in the password fields with valid data
    fireEvent.change(screen.getByPlaceholderText("رمز‌ عبور جدید"), { target: { value: "ValidPass123!" } });
    fireEvent.change(screen.getByPlaceholderText("تکرار رمز عبور جدید"), { target: { value: "ValidPass123!" } });

    // Click on submit button
    fireEvent.click(screen.getByText("تایید"));

    // Wait for the success toast message
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("رمزعبور با موفقیت بازیابی شد"));
  });

  test("shows error toast on failed API call", async () => {
    // Mock the axios response for a failed API call
    axios.post.mockRejectedValue({
      response: { request: { responseText: "System.Exception: Failed to reset password!" } },
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ResetPassword />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill in the password fields with valid data
    fireEvent.change(screen.getByPlaceholderText("رمز‌ عبور جدید"), { target: { value: "ValidPass123!" } });
    fireEvent.change(screen.getByPlaceholderText("تکرار رمز عبور جدید"), { target: { value: "ValidPass123!" } });

    // Click on submit button
    fireEvent.click(screen.getByText("تایید"));

    // Wait for the error toast message
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("توکن معتبر نمی باشد"));
  });

  test("shows error toast on network failure", async () => {
    // Mock the axios response for a network failure
    axios.post.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <BrowserRouter>
        <AuthProvider>
          <ResetPassword />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill in the password fields with valid data
    fireEvent.change(screen.getByPlaceholderText("رمز‌ عبور جدید"), { target: { value: "ValidPass123!" } });
    fireEvent.change(screen.getByPlaceholderText("تکرار رمز عبور جدید"), { target: { value: "ValidPass123!" } });

    // Click on submit button
    fireEvent.click(screen.getByText("تایید"));

    // Wait for the error toast message
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("خطا در برقراری ارتباط با سرور"));
  });
});
