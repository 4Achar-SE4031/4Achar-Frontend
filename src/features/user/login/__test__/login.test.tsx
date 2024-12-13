import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthProvider from "../authProvider";
import Login from "../Login";



const mockLoginAction = vi.fn();
const mockUseAuth = vi.fn(() => ({
  loginAction: mockLoginAction,
}));

// Mock authProvider module
vi.mock("./authProvider.tsx", () => ({
  useAuth: mockUseAuth,
}));


describe("Login Component", () => {
//   const mockLoginAction = vi.fn();
//   const mockUseAuth = vi.fn(() => ({
//     // loginAction: mockLoginAction,
//     loginAction: vi.fn()
//   }));

//   vi.mock("../authProvider.tsx", () => ({
//     useAuth: mockUseAuth,
//   }));

  beforeEach(() => {
    // Reset mocks before each test
    mockLoginAction.mockReset();
  });



  it("renders the login form correctly", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText("نام کاربری")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("رمز عبور")).toBeInTheDocument();
    expect(screen.getByText("ورود کاربران")).toBeInTheDocument();
  });

  it("validates username input correctly", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText("نام کاربری");
    fireEvent.change(usernameInput, { target: { value: "12" } });
    fireEvent.click(screen.getByText("ورود"));

    await waitFor(() => {
      expect(screen.getByText(/نام کاربری شامل 3 تا 30 کاراکتر است/)).toBeInTheDocument();
    });
  });

  it("validates password input correctly", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText("رمز عبور");
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.click(screen.getByText("ورود"));

    await waitFor(() => {
      expect(screen.getByText(/رمزعبور حداقل باید شامل 8 کاراکتر باشد/)).toBeInTheDocument();
    });
  });

  it("shows success toast on successful login", async () => {
    mockLoginAction.mockResolvedValue("Data received successfully");

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
        <ToastContainer />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText("نام کاربری");
    const passwordInput = screen.getByPlaceholderText("رمز عبور");
    fireEvent.change(usernameInput, { target: { value: "validUser" } });
    fireEvent.change(passwordInput, { target: { value: "ValidPass123!" } });
    fireEvent.click(screen.getByText("ورود"));

    await waitFor(() => {
      expect(mockLoginAction).toHaveBeenCalledWith({
        username: "validUser",
        password: "ValidPass123!",
      });
      expect(screen.getByText(/با موفقیت وارد شدید/)).toBeInTheDocument();
    });
  });

  it("shows error toast on incorrect username", async () => {
    mockLoginAction.mockResolvedValue("username does not exist");

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
        <ToastContainer />
      </BrowserRouter>
    );

    const usernameInput = screen.getByPlaceholderText("نام کاربری");
    fireEvent.change(usernameInput, { target: { value: "wrongUser" } });
    fireEvent.click(screen.getByText("ورود"));

    await waitFor(() => {
      expect(screen.getByText(/نام کاربری وارد شده در سیستم وجود ندارد/)).toBeInTheDocument();
    });
  });

  it("toggles password visibility", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText("رمز عبور");
    const toggleButton = screen.getByRole("button", { hidden: true });

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
