import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import  AuthProvider  from "../login/authProvider"; // اطمینان حاصل کنید که AuthProvider را به درستی وارد کرده‌اید.
import ConcertDetails from "./concert_details";
import { vi } from "vitest";
import { BrowserRouter as Router } from "react-router-dom"; // وارد کردن Router
import SearchProvider from "../../Search/searchStatus";

// Mock necessary components and data
vi.mock("src/features/navbar/Navbar", () => ({
    __esModule: true,
    default: () => <div>Navbar Mock</div>,
  }));
  
  vi.mock("src/features/musicNotes/MusicNotes", () => ({
    __esModule: true,
    default: ({ count }: { count: number }) => <div>Music Notes: {count}</div>,
  }));
  
  vi.mock("src/features/expandablePrice/ExpandablePrice", () => ({
    __esModule: true,
    default: ({ prices }: { prices: string[] }) => <div>Expandable Price: {prices.join(", ")}</div>,
  }));
  
  vi.mock("src/features/map/MapComponent", () => ({
    __esModule: true,
    default: ({ address }: { address: string }) => <div>Map Component: {address}</div>,
  }));
  
  const mockData = {
    eventDetails: {
      title: "Concert Title",
      ticketPrice: ["1000", "2000"],
      province: "Tehran",
      city: "Tehran",
      category: "Music",
      organizer_name: "John Doe",
      organizer_photo: "",
      photo: "",
      description: "Event description",
      address: "123 Street",
      location_lat: 35.6892,
      location_lon: 51.3890,
      url: "https://event.com",
    },
    eventDateTime: {
      startDay: "12",
      startMonth: "Feb",
      startYear: "2025",
      startTime: "7:00 PM",
      startWeekDay: "Monday",
    },
    canPurchase: true,
    screenSize: "large",
    loading: false,
    error: false,
    isFavorite: false,
  };
  
  describe("ConcertDetails Component", () => {
    it("renders loading state", () => {
      render(
        <Router>
          <AuthProvider>
          <SearchProvider>

            <ConcertDetails {...mockData} loading={true} error={false} />
            </SearchProvider>

          </AuthProvider>
        </Router>
      );
  
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  
    it("renders error state", () => {
      render(
        <Router>
          <AuthProvider>
          <SearchProvider>

            <ConcertDetails {...mockData} loading={false} error={true} />
            </SearchProvider>

          </AuthProvider>
        </Router>
      );
  
      expect(screen.getByText(/PageNotFound/i)).toBeInTheDocument();
    });
  
    it("renders concert details correctly", async () => {
      render(
        <Router>
          <AuthProvider>
          <SearchProvider>

            <ConcertDetails {...mockData} loading={false} error={false} />
            </SearchProvider>

          </AuthProvider>
        </Router>
      );
  
      expect(screen.getByText("Concert Title")).toBeInTheDocument();
      expect(screen.getByText("Expandable Price: 1000, 2000")).toBeInTheDocument();
      expect(screen.getByText("Map Component: 123 Street")).toBeInTheDocument();
      expect(screen.getByText("Music Notes: 30")).toBeInTheDocument();
    });
  
    it("toggles favorite icon on click", async () => {
      const toggleFavorite = vi.fn();
      render(
        <Router>
          <AuthProvider>
          <SearchProvider>

            <ConcertDetails {...mockData} loading={false} error={false} isFavorite={false} toggleFavorite={toggleFavorite} />
            </SearchProvider>

          </AuthProvider>

        </Router>
      );
  
      const heartIcon = screen.getByRole("button");
      fireEvent.click(heartIcon);
  
      await waitFor(() => expect(toggleFavorite).toHaveBeenCalledTimes(1));
    });
  
    it("opens a new tab when the buy ticket button is clicked", async () => {
      render(
        <Router>
          <AuthProvider>
            <SearchProvider>
            <ConcertDetails {...mockData} loading={false} error={false} />
            </SearchProvider>
          </AuthProvider>
        </Router>
      );
  
      const button = screen.getByText("خرید بلیت");
      fireEvent.click(button);
  
      await waitFor(() => expect(window.open).toHaveBeenCalledWith(mockData.eventDetails.url, "_blank"));
    });
  });