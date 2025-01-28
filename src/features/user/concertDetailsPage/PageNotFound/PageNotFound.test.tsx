import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PageNotFound from "./PageNotFound";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import AuthProvider from "../../login/authProvider";
import { Search } from "lucide-react";
import SearchProvider from "../../../Search/searchStatus";

// Mocking the Lottie component to avoid actual animation rendering during tests
vi.mock("react-lottie", () => ({
  __esModule: true,
  default: () => <div>Mocked Lottie</div>,
}));

test("renders PageNotFound component correctly", () => {
  // Render the component wrapped in BrowserRouter to handle routing
  render(
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <PageNotFound />
        </SearchProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  // Check if the animation mock appears
  expect(screen.getByText("Mocked Lottie")).toBeInTheDocument();

  // Check if the text elements appear
  expect(screen.getByText("صفحه مورد نظر شما یافت نشد!")).toBeInTheDocument();
  expect(screen.getByText("احتمالا این صفحه به آدرس دیگری تغییر کرده یا حذف شده است.")).toBeInTheDocument();

  // Check if the button is rendered
  const button = screen.getByRole("button", { name: "بازگشت به خانه" });
  expect(button).toBeInTheDocument();

  // Simulate a click on the button and verify the navigation action
  fireEvent.click(button);
  
  // Check for the relative URL
  expect(window.location.pathname).toBe("/");
});
