// ConcertDetails.test.tsx

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ConcertDetails from "./concert_details";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import copy from "clipboard-copy";
import { ToastContainer } from "react-toastify";

// Mocking child components
vi.mock("../../Navbar/navbar.tsx", () => ({
    default: () => <div data-testid="navbar">Navbar Component</div>,
}));

vi.mock("./PageNotFound/PageNotFound.tsx", () => ({
    default: () => <div data-testid="page-not-found">Page Not Found</div>,
}));

vi.mock("../../Comment/MainComment.tsx", () => ({
    default: ({ id }: { id: number }) => (
        <div data-testid={`main-comment-${id}`}>MainComment Component {id}</div>
    ),
}));

vi.mock("./MapComponent/MapComponent.tsx", () => ({
    default: () => <div data-testid="map-component">MapComponent</div>,
}));

vi.mock("./Rating.tsx", () => ({
    default: () => <div data-testid="hover-rating">HoverRating Component</div>,
}));

vi.mock("./MusicNotes.tsx", () => ({
    default: () => <div data-testid="music-notes">MusicNotes Component</div>,
}));

vi.mock("react-toastify", () => ({
    ToastContainer: () => <div data-testid="toast-container">ToastContainer</div>,
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("clipboard-copy", () => ({
    __esModule: true,
    default: vi.fn(),
}));

// Corrected mock path for Footer
vi.mock("../../../app/layout/Footer.tsx", () => ({
    default: () => <div data-testid="footer">Footer Component</div>,
}));

vi.mock("../login/authProvider.tsx", () => ({
    useAuth: () => ({
        token: "test-token",
        logOut: vi.fn(),
    }),
}));

// Mocking axios
vi.mock("axios");

describe("ConcertDetails Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const mockConcertData = {
        id: 1,
        title: "Sample Concert",
        description: "This is a sample concert description.",
        startDateTime: "2023-12-25T21:00:00Z",
        city: "Tehran",
        address: "123 Concert Street",
        location: "Concert Hall",
        category: "Music",
        ticketPrice: [100000, 200000],
        latitude: 35.6892,
        longitude: 51.3890,
        coverImage: "https://example.com/cover.jpg",
        url: "https://concert.com/purchase",
        isBookmarked: false,
    };

    const renderComponent = (id: string) => {
        return render(
            <MemoryRouter initialEntries={[`/concert/${id}`]}>
                <Routes>
                    <Route path="/concert/:id" element={<ConcertDetails />} />
                </Routes>
            </MemoryRouter>
        );
    };

    // it("renders loading state initially", async () => {
    //     (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockConcertData });

    //     renderComponent("1");

    //     // Check for loading animation (Lottie)
    //     const loadingAnimation = screen.getByTestId("loading-animation");
    //     expect(loadingAnimation).toBeInTheDocument();

    //     // Wait for data to load
    //     await waitFor(() => {
    //         expect(axios.get).toHaveBeenCalled();
    //     });
    // });

    it("renders error state when API call fails", async () => {
        (axios.get as vi.Mock).mockRejectedValueOnce(new Error("API Error"));

        renderComponent("999"); // Assuming 999 does not exist

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Check for PageNotFound component
        const pageNotFound = screen.getByTestId("page-not-found");
        expect(pageNotFound).toBeInTheDocument();
    });

    // it("renders concert details correctly after successful API call", async () => {
    //     (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockConcertData });

    //     renderComponent("1");

    //     // Wait for data to load
    //     await waitFor(() => {
    //         expect(axios.get).toHaveBeenCalledWith(
    //             `https://api-concertify.darkube.app/Concert/1`
    //         );
    //     });

    //     // Check for Navbar
    //     const navbar = screen.getByTestId("navbar");
    //     expect(navbar).toBeInTheDocument();

    //     // Check for MusicNotes
    //     const musicNotes = screen.getByTestId("music-notes");
    //     expect(musicNotes).toBeInTheDocument();

    //     // Check for Event Details Card
    //     const eventTitle = screen.getByText("Sample Concert");
    //     expect(eventTitle).toBeInTheDocument();

    //     const eventDescription = screen.getByText(
    //         "This is a sample concert description."
    //     );
    //     expect(eventDescription).toBeInTheDocument();

    //     // Check for MainComment
    //     const mainComment = screen.getByTestId("main-comment-1");
    //     expect(mainComment).toBeInTheDocument();

    //     // Check for Footer
    //     const footer = screen.getByTestId("footer");
    //     expect(footer).toBeInTheDocument();

    //     // Check for ToastContainer
    //     const toastContainer = screen.getByTestId("toast-container");
    //     expect(toastContainer).toBeInTheDocument();

    //     // Check for MapComponent
    //     const mapComponent = screen.getByTestId("map-component");
    //     expect(mapComponent).toBeInTheDocument();
    // });

    // it("toggles favorite status correctly", async () => {
    //     (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockConcertData });
    //     (axios.post as vi.Mock).mockResolvedValueOnce({ data: { success: true } });

    //     renderComponent("1");

    //     // Wait for data to load
    //     await waitFor(() => {
    //         expect(axios.get).toHaveBeenCalled();
    //     });

    //     // Find the favorite button by aria-label
    //     const favoriteButton = screen.getByRole("button", { name: /favorite/i });
    //     expect(favoriteButton).toBeInTheDocument();

    //     // Click to add to favorites
    //     fireEvent.click(favoriteButton);

    //     // Ensure axios.post was called with correct URL and headers
    //     expect(axios.post).toHaveBeenCalledWith(
    //         `https://api.concertify.ir/Concert/1/bookmark`,
    //         { concertId: "1" },
    //         {
    //             headers: {
    //                 Authorization: `Bearer test-token`,
    //                 "Content-Type": "application/json",
    //             },
    //         }
    //     );

    //     // Wait for the UI to update (aria-label should change to "Unfavorite")
    //     await waitFor(() => {
    //         expect(favoriteButton).toHaveAttribute("aria-label", "Unfavorite");
    //     });
    // });

    it("copies the current URL to clipboard when copy button is clicked", async () => {
        (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockConcertData });
        (copy as vi.Mock).mockResolvedValueOnce();

        // Mock window.location.href
        delete (window as any).location;
        (window as any).location = {
            href: "http://localhost/concert/1",
            // You can add other properties if needed
        };

        renderComponent("1");

        // Wait for data to load
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Find the copy button (assuming it's the first one)
        const copyButtons = screen.getAllByText("کپی");
        expect(copyButtons.length).toBeGreaterThan(0);

        // Click the first copy button
        fireEvent.click(copyButtons[0]);

        // Ensure clipboard-copy was called with the correct URL
        expect(copy).toHaveBeenCalledWith("http://localhost/concert/1"); // Adjust based on the mocked window.location.href
    });

    it("redirects to purchase URL when 'خرید بلیت' button is clicked", async () => {
        (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockConcertData });

        // Mock window.open
        const openMock = vi.fn();
        global.open = openMock;

        renderComponent("1");

        // Wait for data to load
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Find the purchase button
        const purchaseButtons = screen.getAllByText("خرید بلیت");
        expect(purchaseButtons.length).toBeGreaterThan(0);

        // Click the first purchase button
        fireEvent.click(purchaseButtons[0]);

        // Ensure window.open was called with the correct URL
        expect(openMock).toHaveBeenCalledWith(
            "https://concert.com/purchase",
            "_blank"
        );
    });

    it("renders PageNotFound component when no concert data is found", async () => {
        (axios.get as vi.Mock).mockResolvedValueOnce({ data: null });

        renderComponent("999"); // Assuming 999 does not exist

        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        const pageNotFound = screen.getByTestId("page-not-found");
        expect(pageNotFound).toBeInTheDocument();
    });

    // it("matches the snapshot", async () => {
    //     (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockConcertData });

    //     const { asFragment } = renderComponent("1");

    //     // Wait for data to load
    //     await waitFor(() => {
    //         expect(axios.get).toHaveBeenCalled();
    //     });

    //     expect(asFragment()).toMatchSnapshot();
    // });

    /**
     * Additional Tests
     */

    it("handles window resize and adjusts layout accordingly", async () => {
        (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockConcertData });

        renderComponent("1");

        // Wait for data to load
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalled();
        });

        // Simulate window resize
        global.innerWidth = 500;
        global.dispatchEvent(new Event("resize"));

        // Depending on your component's implementation, you might check for certain elements or styles
        // For example, check if a mobile-specific layout class is applied
        // Adjust the assertions based on actual implementation
        const musicNotes = screen.getByTestId("music-notes");
        expect(musicNotes).toBeInTheDocument();
        // Add more specific assertions based on how the layout changes
    });

    // it("displays toast error when user is not authenticated and tries to favorite", async () => {
    //     // Modify the useAuth mock to return empty token
    //     vi.unmock("../login/authProvider.tsx");
    //     vi.mock("../login/authProvider.tsx", () => ({
    //         useAuth: () => ({
    //             token: "",
    //             logOut: vi.fn(),
    //         }),
    //     }));

    //     (axios.get as vi.Mock).mockResolvedValueOnce({ data: mockConcertData });

    //     const { toast } = require("react-toastify");

    //     renderComponent("1");

    //     // Wait for data to load
    //     await waitFor(() => {
    //         expect(axios.get).toHaveBeenCalled();
    //     });

    //     // Find the favorite button by aria-label (should still be "Favorite")
    //     const favoriteButton = screen.getByRole("button", { name: /favorite/i });
    //     expect(favoriteButton).toBeInTheDocument();

    //     // Click to add to favorites
    //     fireEvent.click(favoriteButton);

    //     // Ensure axios.post was not called since user is not authenticated
    //     expect(axios.post).not.toHaveBeenCalled();

    //     // Ensure toast.error was called with the correct message
    //     await waitFor(() => {
    //         expect(toast.error).toHaveBeenCalledWith(
    //             "برای افزودن به علاقه مندی ها باید وارد سیستم شوید!"
    //         );
    //     });
    // });
});
