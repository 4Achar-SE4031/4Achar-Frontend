import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SearchProvider from "./searchStatus"; // Import SearchProvider
import Search from "./search"; // Import the Search component
import  AuthProvider  from '../user/login/authProvider';

test("renders loading animation when searchStatus is 'Loading'", () => {
  render(
    <BrowserRouter>
      <SearchProvider>
        <AuthProvider>
            <Search />
        </AuthProvider>
      </SearchProvider>
    </BrowserRouter>
  );
  expect(screen.queryByText("loading")).not.toBeInTheDocument();
});
