import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./navbar";
import { useAuth } from "../user/login/authProvider";

jest.mock("../user/login/authProvider", () => ({
  useAuth: jest.fn(),
}));
jest.mock("axios", () => ({
  get: jest.fn(),
}));

const mockedUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe("Navbar Component", () => {
  const mockLogOut = jest.fn();

  beforeEach(() => {
    mockedUseAuth.mockReturnValue({
      token: null,
      logOut: mockLogOut,
    });
  });

  test("renders the logo and search bar", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logo = screen.getByAltText("Logo");
    expect(logo).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText("جستجو...");
    expect(searchInput).toBeInTheDocument();
  });

  test("renders login and register links when user is not authenticated", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const loginLink = screen.getByText("ورود");
    const registerLink = screen.getByText("عضویت");

    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });

  test("renders user profile and logout when user is authenticated", () => {
    mockedUseAuth.mockReturnValue({
      token: "mock-token",
      logOut: mockLogOut,
    });
    localStorage.setItem("userData", JSON.stringify({ userName: "Test User" }));

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const userName = screen.getByText("Test User");
    const logoutButton = screen.getByText("خروج");

    expect(userName).toBeInTheDocument();
    expect(logoutButton).toBeInTheDocument();
  });

  test("calls logOut and shows toast on logout", () => {
    mockedUseAuth.mockReturnValue({
      token: "mock-token",
      logOut: mockLogOut,
    });

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const logoutButton = screen.getByText("خروج");

    fireEvent.click(logoutButton);

    expect(mockLogOut).toHaveBeenCalled();
  });

  test("toggles the drawer when menu icon is clicked", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const menuIcon = screen.getByRole("button", { name: /menu/i });

    fireEvent.click(menuIcon);

    const drawer = screen.getByRole("navigation");
    expect(drawer).toHaveClass("active");
  });

  test("updates search box text on input change", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText("جستجو...");

    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput.value).toBe("test");
  });
});
