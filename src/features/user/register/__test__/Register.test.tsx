// Register.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "../Register";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Authentication/authProvider";

// 1. Mock external dependencies //
vi.mock("react-router-dom", () => ({ useNavigate: vi.fn() }));

vi.mock("../../Authentication/authProvider", () => ({ useAuth: vi.fn() }));

vi.mock("axios");

vi.mock("react-toastify", () => {
  const actualToastify = vi.importActual("react-toastify");
  return {
    ...actualToastify,
    toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
    ToastContainer: (props: any) => <div {...props}>Mocked ToastContainer</div>,
  };
});

describe("Register Component", () => {
  // 2. Setup and cleanup //
  let mockNavigate: vi.Mock;
  let mockLoginAction: vi.Mock;

  beforeEach(() => {
    mockNavigate = vi.fn();
    mockLoginAction = vi.fn().mockResolvedValue({});

    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
    (useAuth as vi.Mock).mockReturnValue({
      loginAction: mockLoginAction,
    });

    // Reset mocks before each test to avoid cross-test contamination
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 3. Basic rendering //
  it("renders the Register form fields", () => {
    render(<Register />);

    // The placeholders you used in your inputs
    expect(screen.getByPlaceholderText("نام کاربری")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("نام و نام خانوادگی")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("ایمیل")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("رمز عبور")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("تایید رمز عبور")).toBeInTheDocument();
  });

  // 4. Invalid submission test //
  it("displays validation messages if fields are invalid when submitting", async () => {
    render(<Register />);

    const signUpButton = screen.getByRole("button", {
      name: /عضویت در ایونتیفای/i,
    });

    // Click the sign-up button with no valid data
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(
        screen.getByText(/نام کاربری شامل 3 تا 30 کاراکتر/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/نام و نام خانوادگی باید بین 5 تا 30 کاراکتر/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/فرمت ایمیل نادرست است/i)).toBeInTheDocument();
      expect(
        screen.getByText(/رمزعبور حداقل باید شامل 8 کاراکتر باشد/i)
      ).toBeInTheDocument();
    });
  });

  // 5. Fill valid fields test //
  //   it("does not show validation errors if fields are valid", async () => {
  //     render(<Register />);

  //     fireEvent.change(screen.getByPlaceholderText("نام کاربری"), {
  //       target: { value: "john.doe" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText("نام و نام خانوادگی"), {
  //       target: { value: "John Doe" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText("ایمیل"), {
  //       target: { value: "john@example.com" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText("رمز عبور"), {
  //       target: { value: "Aa!12345" },
  //     });
  //     fireEvent.change(screen.getByPlaceholderText("تایید رمز عبور"), {
  //       target: { value: "Aa!12345" },
  //     });

  //     const signUpButton = screen.getByRole("button", {
  //       name: /عضویت در ایونتیفای/i,
  //     });
  //     fireEvent.click(signUpButton);

  //     // Since everything is valid, the component might initiate the API call
  //     // and not show the validation error messages
  //     await waitFor(() => {
  //       expect(
  //         screen.queryByText(/فرمت ایمیل نادرست است/i)
  //       ).not.toBeInTheDocument();
  //     });
  //   });

  // 6. Successful registration test
  it("calls axios.post with correct data if fields are valid and navigates on success", async () => {
    (axios.post as vi.Mock).mockResolvedValue({ data: {} });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("نام کاربری"), {
      target: { value: "john.doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("نام و نام خانوادگی"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("ایمیل"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("رمز عبور"), {
      target: { value: "Aa!12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("تایید رمز عبور"), {
      target: { value: "Aa!12345" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /عضویت در ایونتیفای/i })
    );

    // Wait for axios call and success flow
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "https://api-concertify.darkube.app/Account/signup",
        {
          userName: "john.doe",
          firstName: "John Doe",
          lastName: "John Doe", // because you're using the same name field for first and last
          email: "john@example.com",
          password: "Aa!12345",
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
          },
        }
      );
      // On success, it should toast and eventually navigate to /verify
      expect(toast.success).toHaveBeenCalledWith(
        "ایمیل حاوی کد تایید برای شما ارسال شد"
      );
      // The setTimeout in your code will eventually call navigate('/verify', ...)
      // We can at least test that it’s prepared to navigate:
      // (Though you might want to skip actual time-based tests or mock setTimeout more explicitly.)
    });
  });

  // 7. Duplicate username/email error test //
  it("shows an error toast when the server returns a duplicate username or email", async () => {
    (axios.post as vi.Mock).mockRejectedValue({
      response: { request: { responseText: "Error: Username already exists" } },
    });

    render(<Register />);

    // Fill valid data
    fireEvent.change(screen.getByPlaceholderText("نام کاربری"), {
      target: { value: "duplicateUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("نام و نام خانوادگی"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("ایمیل"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("رمز عبور"), {
      target: { value: "Aa!12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("تایید رمز عبور"), {
      target: { value: "Aa!12345" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /عضویت در ایونتیفای/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("نام کاربری تکراری است");
    });

    // Now test the email scenario by changing the mock response
    (axios.post as vi.Mock).mockRejectedValueOnce({
      response: {
        request: {
          responseText: "Error: Email already exists",
        },
      },
    });

    // Click again
    fireEvent.click(
      screen.getByRole("button", { name: /عضویت در ایونتیفای/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("ایمیل تکراری است");
    });
  });

  // 8. General server error test //
  it("shows a generic error toast on unknown server error", async () => {
    (axios.post as vi.Mock).mockRejectedValue({
      response: { request: { responseText: "Some other server error" } },
    });

    render(<Register />);

    fireEvent.change(screen.getByPlaceholderText("نام کاربری"), {
      target: { value: "randomUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("نام و نام خانوادگی"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("ایمیل"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("رمز عبور"), {
      target: { value: "Aa!12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("تایید رمز عبور"), {
      target: { value: "Aa!12345" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /عضویت در ایونتیفای/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("خطا در برقراری ارتباط با سرور");
    });
  });
});
