import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Favorites from "./favorites";
import { vi } from "vitest";
import { useAuth } from "../user/login/authProvider";
import { SearchProvider } from "../Search/searchStatus";
import userEvent from "@testing-library/user-event";
import axios from "axios";

vi.mock("../user/login/authProvider", () => ({
  useAuth: vi.fn(),
}));

// Mocking the `react-router-dom` module
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom"); // Import actual implementation to avoid breaking other hooks
  return {
    ...actual,
    useNavigate: () => mockNavigate, // Mock `useNavigate`
  };
});

// Mocking Lottie animation
vi.mock("react-lottie", () => ({
  __esModule: true,
  default: () => <div data-testid="lottie-animation"></div>,
}));

vi.mock("axios", async (importOriginal) => {
    const actual = await importOriginal(); // Import the original `axios` for non-mocked methods
    return {
      ...actual, // Keep other axios properties
      default: {
        ...actual.default,
        get: vi.fn(() => 
          Promise.resolve({
            data: {
              concerts: [
                {
                  id: "1",
                  title: "Test Concert",
                  location: "Test Location",
                  startDateTime: "2025-01-28T20:00:00",
                  cardImage: "test-image.jpg",
                },
              ],
            },
          })
        ),
      },
    };
  });
  


describe("Favorites Component", () => {
    beforeEach(() => {
        (useAuth as vi.Mock).mockReturnValue({ token: "test-token" });
    });
    
    it("renders the Navbar in all cases", () => {
        render(
        <MemoryRouter>
            <SearchProvider>
            <Favorites />
            </SearchProvider>
        </MemoryRouter>
        );
    
        const navbar = screen.getByRole("navigation");
        expect(navbar).toBeInTheDocument();
    });
    
    it("displays loading animation while fetching data", () => {
        render(
        <MemoryRouter>
            <SearchProvider>
                <Favorites />
            </SearchProvider>
        </MemoryRouter>
        );
    
        const loadingAnimation = screen.getByTestId("lottie-animation");
        expect(loadingAnimation).toBeInTheDocument();
    });
    
    it("displays error animation on API failure", async () => {
        (axios.get as vi.Mock).mockRejectedValue(new Error("API error"));
    
        render(
        <MemoryRouter>
            <SearchProvider>
            <Favorites />
            </SearchProvider>
        </MemoryRouter>
        );
    
        await waitFor(() => {
        const errorAnimation = screen.getByTestId("lottie-animation");
        expect(errorAnimation).toBeInTheDocument();
        });
    });
    
    // it("displays a message when no concerts are saved", async () => {
    //     // Mock the API response with an empty concerts array
    //     (axios.get as vi.Mock).mockResolvedValue({ data: { concerts: [] } });
        
    //     // Render the component inside the necessary providers
    //     render(
    //       <MemoryRouter>
    //         <SearchProvider>
    //           <Favorites />
    //         </SearchProvider>
    //       </MemoryRouter>
    //     );
        
    //     // Wait for the state to be updated, i.e., the message should appear
    //     await waitFor(() => {
    //       const noConcertsMessage = screen.getByTestId("no-concerts-message"); // Ensure the test ID is correct
    //       expect(noConcertsMessage).toBeInTheDocument();
    //     });
    //   });
      
      
      
        
    
    //   it("renders concert cards correctly when data is available", async () => {
    //     const mockData = {
    //       concerts: [
    //         { id: "1", title: "Concert 1", location: "Location 1", cardImage: "/img1.jpg", startDateTime: "2025-02-15T20:00:00" },
    //         { id: "2", title: "Concert 2", location: "Location 2", cardImage: "/img2.jpg", startDateTime: "2025-03-10T18:00:00" },
    //       ],
    //     };
    //     (axios.get as vi.Mock).mockResolvedValue({ data: mockData });
      
    //     render(
    //       <MemoryRouter>
    //         <SearchProvider>
    //           <Favorites />
    //         </SearchProvider>
    //       </MemoryRouter>
    //     );
      
    //     await waitFor(() => {
    //       const concertCards = screen.getAllByRole("button", { name: /خرید بلیت/i });
    //       expect(concertCards).toHaveLength(2);
    //       expect(screen.getByText("Concert 1")).toBeInTheDocument();
    //       expect(screen.getByText("Concert 2")).toBeInTheDocument();
    //     });
    //   });
      
    
    // it("navigates to concert detail page on card click", async () => {
    //     const mockData = {
    //       concerts: [
    //         { id: "1", title: "Concert 1", location: "Location 1", cardImage: "/img1.jpg", startDateTime: "2025-02-15T20:00:00" },
    //       ],
    //     };
    //     (axios.get as vi.Mock).mockResolvedValue({ data: mockData });
      
    //     render(
    //       <MemoryRouter>
    //         <SearchProvider>
    //           <Favorites />
    //         </SearchProvider>
    //       </MemoryRouter>
    //     );
      
    //     await waitFor(() => {
    //       const concertCard = screen.getByText("Concert 1");
    //       userEvent.click(concertCard);
      
    //       expect(mockNavigate).toHaveBeenCalledWith("/concertDetail/1");
    //     });
    //   });
      
});
