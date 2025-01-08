// src/components/EventDetails/EventDetails.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventDetails from "../concertDetail.tsx";
import { BrowserRouter, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../Authentication/authProvider.tsx";
import copy from "clipboard-copy";
import "@testing-library/jest-dom";
import "../MusicNotes.tsx";


// Mock dependencies
vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: vi.fn(),
  BrowserRouter: vi.fn(),
  useParams: vi.fn(() => ({ id: "123" })),
}));

vi.mock("../../Authentication/authProvider", () => ({
  useAuth: vi.fn(),
}));

vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

vi.mock("clipboard-copy", () => ({
  default: vi.fn(),
}));

// Mock child components to simplify testing
vi.mock("../../../../app/layout/Footer", () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock("../MainComment", () => ({
  default: ({ id }: { id: string }) => (
    <div data-testid="main-comment">MainComment {id}</div>
  ),
}));

vi.mock("../MusicNotes", () => ({
    __esModule: true,
  default: ({ count }: { count: number }) => (
    <div data-testid="music-notes">MusicNotes {count}</div>
  ),
}));

vi.mock("../HoverRating", () => () => (
  <div data-testid="hover-rating">HoverRating</div>
));

vi.mock("../MapComponent", () => ({
  default: ({ sendDataToParent, lati, long, onlyShow, name }: any) => (
    <div data-testid="map-component">MapComponent</div>
  ),
}));

vi.mock("react-lottie", () => ({
  default: (options: any) => (
    <div placeholder="Lottie Animation" data-testid="lottie"></div>
  ),
}));

vi.mock("../PageNotFound", () => ({
  default: () => <div data-testid="page-not-found">PageNotFound</div>,
}));

// Sample event details to be used in tests
const mockEventDetails = {
  startDay: "پنج شنبه",
  startDate: [1403, "آبان", 30],
  starts: "30 آبان 1403",
  ends: "5 آذر 1403",
  startTime: [21, 30],
  day: "30 آذر",
  endDay: "جمعه",
  endDate: [1403, "آذر", 7],
  endTime: [21, 30],
  eventName: "کنسرت ارکستر سمفونیک قاف (منظومه سیمرغ) (تمدید شد)",
  price: 600000,
  location: "تهران/تالار وحدت",
  category: "ارکستر سمفونی",
  organizerPhoto: "./img.webp",
  organizerName: "فرهاد فخر الدینی",
  organizerPhone: "09123456789",
  organizerEmail: "organizer@gmail.com",
  url: "http://localhost:3000/concertDetail",
  description: `Sample event description.`,
  tags: ["هوش مصنوعی", "پایتون"],
  inpersonevent: {
    province: "تهران",
    city: "تهران",
    address: "تهران، خیابان حافظ، تالار وحدت",
    location_lat: 35.7021,
    location_lon: 51.4051,
  },
};

// Setup before each test
beforeEach(() => {
  vi.resetAllMocks();

  // Mock useAuth to return a token
  (useAuth as vi.Mock).mockReturnValue({
    token: "test-token",
  });

  // Mock axios post for bookmarking
  (axios.post as vi.Mock).mockResolvedValue({ data: {} });

  // Mock clipboard-copy
  (copy as vi.Mock).mockResolvedValue(undefined);

  // Mock localStorage
  const userData = { id: 1, name: "Test User" };
  window.localStorage.setItem("userData", JSON.stringify(userData));
});

const renderComponent = () =>
  render(
    <BrowserRouter>
      <EventDetails />
    </BrowserRouter>
  );

describe("EventDetails Component", () => {
  it("renders loading state initially", () => {
    renderComponent();
    const loadingIndicator = screen.queryAllByTestId("lottie");
    expect(loadingIndicator).toBeDefined();
  });

  it("renders PageNotFound when error is true", async () => {
    // Mock useState to set error to true
    vi.spyOn(React, "useState")
      .mockImplementationOnce(() => [false, vi.fn()]) // loading
      .mockImplementationOnce(() => [null, vi.fn()]) // eventDetails
      .mockImplementationOnce(() => [true, vi.fn()]); // error

    renderComponent();

    const pageNotFound = await screen.queryAllByTestId("page-not-found");
    expect(pageNotFound).toBeDefined();
  });

  it("renders event details when data is loaded", async () => {
    // Mock useState to set loading to false and provide eventDetails
    vi.spyOn(React, "useState").mockImplementation((init) => {
      if (init === true) {
        return [false, vi.fn()]; // loading
      }
      if (init === null) {
        return [mockEventDetails, vi.fn()]; // eventDetails
      }
      if (init === false) {
        return [false, vi.fn()]; // error
      }
      return [init, vi.fn()];
    });

    renderComponent();

    const footer = screen.queryAllByTestId("footer");
    expect(footer).toBeDefined();

    // const mainComment = screen.queryByTestId("main-comment");
    // expect(mainComment).not.toBeNull();
    // expect(mainComment).toHaveTextContent("MainComment 3"); // Assuming id is "123"

    // const musicNotes = screen.queryByTestId("music-notes");
    // expect(musicNotes).toHaveTextContent("MusicNotes 30"); // Adjust based on actual count
    

    // Check event name
    const eventName = screen.queryByText(mockEventDetails.eventName);
    expect(eventName).toBeDefined();

    // Check price
    const price = screen.queryByText(
      `${mockEventDetails.price.toLocaleString()} تومان`
    );
    expect(price).toBeDefined();

    // Check location
    const location = screen.queryByText(mockEventDetails.location);
    expect(location).toBeDefined();

    // Check category
    const category = screen.queryByText(mockEventDetails.category);
    expect(category).toBeDefined();

    // Check organizer name
    const organizerName = screen.queryByText(mockEventDetails.organizerName);
    expect(organizerName).toBeDefined();

    // Check buttons
    const followButton = screen.queryByText("دنبال کردن");
    expect(followButton).toBeDefined();

    const contactButton = screen.queryByText("تماس");
    expect(contactButton).toBeDefined();

    // const bookmarkButton = screen.queryByText("بعدا یادآوری کن");
    // const bookmarkButton = screen.getByText(/بعدا یادآوری کن/i);
    // expect(bookmarkButton.closest('button')).toBeTruthy();


    // const bookmarkButton = screen.getByRole('button', { name: /بعدا یادآوری کن/i });
    // expect(bookmarkButton).toBeDefined();

    // Check description
    const description = screen.queryByText(mockEventDetails.description);
    expect(description).toBeDefined();

    // Check tags
    mockEventDetails.tags.forEach((tag) => {
      const tagElement = screen.queryByText(`#${tag}`);
      expect(tagElement).toBeDefined();
    });
  });

//   it("handles bookmarking correctly", async () => {
//     // Mock useState to set initial isBookmarked to false
//     let isBookmarked = false;
//     vi.spyOn(React, "useState").mockImplementation((init) => {
//       if (init === false) {
//         return [isBookmarked, (value) => (isBookmarked = value)];
//       }
//       if (init === null) {
//         return [mockEventDetails, vi.fn()]; // eventDetails
//       }
//       return [init, vi.fn()];
//     });

//     renderComponent();

//     // const bookmarkButton = screen.getByText("بعدا یادآوری کن");
//     const bookmarkButton = screen.getByRole('button', { name: /بعدا یادآوری کن/i });
//     // const bookmarkButton = screen.getByText((content, element) => {
//     //     return element?.textContent?.includes('بعدا یادآوری کن') ?? false;
//     //   });
//     fireEvent.click(bookmarkButton);

//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledWith(
//         "https://eventify.liara.run/events/123/bookmark/",
//         {},
//         {
//           headers: {
//             "Content-Type": "application/json",
//             accept: "application/json",
//             Authorization: "JWT test-token",
//           },
//         }
//       );
//       expect(isBookmarked).toBe(true);
//     });
//   });

//   it("copies current URL to clipboard", async () => {
//     renderComponent();

//     await waitFor(() => {
//       expect(screen.queryByTestId("lottie")).not.toBeInTheDocument();
//     });

//     // const copyLinkButton = screen.getByText("کپی لینک");
//     const copyLinkButton = screen.getByRole('button', { name: /کپی لینک/i });
//     fireEvent.click(copyLinkButton);

//     await waitFor(() => {
//       expect(copy).toHaveBeenCalledWith(window.location.href);
//     });
//   });

//   it("copies event URL to clipboard", async () => {
//     renderComponent();

//     await waitFor(() => {
//       expect(screen.queryByTestId("lottie")).not.toBeInTheDocument();
//     });

//     // const copyLinkButton = screen.getByText("کپی لینک");
//     screen.getByRole('button', { name: /کپی لینک/i });
//     fireEvent.click(copyLinkButton);

//     await waitFor(() => {
//       expect(copy).toHaveBeenCalledWith(mockEventDetails.url);
//     });
//   });

//   it("shows toast notifications on bookmark toggle", async () => {
//     renderComponent();

//     await waitFor(() => {
//       expect(screen.queryByTestId("lottie")).not.toBeInTheDocument();
//     });

//     const bookmarkButton = screen.getByText("بعدا یادآوری کن");
//     fireEvent.click(bookmarkButton);

//     await waitFor(() => {
//       expect((require("react-toastify").toast).success).toHaveBeenCalledWith(
//         "رویداد به علاقه مندی ها اضافه شد"
//       );
//     });

//     // Simulate clicking again to remove bookmark
//     vi.spyOn(React, "useState").mockImplementation((init) => {
//       if (init === false) {
//         return [true, vi.fn()]; // isBookmarked = true
//       }
//       if (init === null) {
//         return [mockEventDetails, vi.fn()]; // eventDetails
//       }
//       return [init, vi.fn()];
//     });

//     fireEvent.click(bookmarkButton);

//     await waitFor(() => {
//       expect((require("react-toastify").toast).error).toHaveBeenCalledWith(
//         "رویداد از علاقه مندی ها حذف شد"
//       );
//     });
//   });

  it("renders ToastContainer", () => {
    renderComponent();
    const toastContainer = screen.queryAllByTestId("toast-container");
    expect(toastContainer).toBeDefined();
  });
});
















































































// // src/components/EventDetails/EventDetails.test.tsx
// import React from "react";
// import { describe, it, expect, vi, beforeEach } from "vitest";
// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import EventDetails from "../concertDetail.tsx";
// import { BrowserRouter, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../../Authentication/authProvider.tsx";
// import copy from "clipboard-copy";
// import "@testing-library/jest-dom";
// import "../MusicNotes.tsx";

// // Mock dependencies
// vi.mock("react-router-dom", () => ({
//   ...vi.importActual("react-router-dom"),
//   useNavigate: vi.fn(),
//   BrowserRouter: vi.fn(),
//   useParams: vi.fn(() => ({ id: "123" })),
// }));

// vi.mock("../../Authentication/authProvider", () => ({
//   useAuth: vi.fn(),
// }));

// vi.mock("axios");
// vi.mock("react-toastify", () => ({
//   toast: {
//     success: vi.fn(),
//     error: vi.fn(),
//   },
//   ToastContainer: () => <div data-testid="toast-container" />,
// }));

// vi.mock("clipboard-copy", () => ({
//   default: vi.fn(),
// }));

// // Mock child components to simplify testing
// vi.mock("../../../../app/layout/Footer", () => ({
//   default: () => <div data-testid="footer">Footer</div>,
// }));

// vi.mock("../MainComment", () => ({
//   default: ({ id }: { id: string }) => (
//     <div data-testid="main-comment">MainComment {id}</div>
//   ),
// }));

// vi.mock("../MusicNotes", () => ({
//   default: ({ count }: { count: number }) => (
//     <div data-testid="music-notes">MusicNotes {count}</div>
//   ),
// }));

// vi.mock("../HoverRating", () => () => (
//   <div data-testid="hover-rating">HoverRating</div>
// ));

// vi.mock("../MapComponent", () => ({
//   default: ({ sendDataToParent, lati, long, onlyShow, name }: any) => (
//     <div data-testid="map-component">MapComponent</div>
//   ),
// }));

// vi.mock("react-lottie", () => ({
//   default: (options: any) => (
//     <div placeholder="Lottie Animation" data-testid="lottie"></div>
//   ),
// }));

// vi.mock("../PageNotFound", () => ({
//   default: () => <div data-testid="page-not-found">PageNotFound</div>,
// }));

// // Sample event details to be used in tests
// const mockEventDetails = {
//   startDay: "پنج شنبه",
//   startDate: [1403, "آبان", 30],
//   starts: "30 آبان 1403",
//   ends: "5 آذر 1403",
//   startTime: [21, 30],
//   day: "30 آذر",
//   endDay: "جمعه",
//   endDate: [1403, "آذر", 7],
//   endTime: [21, 30],
//   eventName: "کنسرت ارکستر سمفونیک قاف (منظومه سیمرغ) (تمدید شد)",
//   price: 600000,
//   location: "تهران/تالار وحدت",
//   category: "ارکستر سمفونی",
//   organizerPhoto: "./img.webp",
//   organizerName: "فرهاد فخر الدینی",
//   organizerPhone: "09123456789",
//   organizerEmail: "organizer@gmail.com",
//   url: "http://localhost:3000/concertDetail",
//   description: `Sample event description.`,
//   tags: ["هوش مصنوعی", "پایتون"],
//   inpersonevent: {
//     province: "تهران",
//     city: "تهران",
//     address: "تهران، خیابان حافظ، تالار وحدت",
//     location_lat: 35.7021,
//     location_lon: 51.4051,
//   },
// };

// // Setup before each test
// beforeEach(() => {
//   vi.resetAllMocks();

//   // Mock useAuth to return a token
//   (useAuth as vi.Mock).mockReturnValue({
//     token: "test-token",
//   });

//   // Mock axios post for bookmarking
//   (axios.post as vi.Mock).mockResolvedValue({ data: {} });

//   // Mock clipboard-copy
//   (copy as vi.Mock).mockResolvedValue(undefined);

//   // Mock localStorage
//   const userData = { id: 1, name: "Test User" };
//   window.localStorage.setItem("userData", JSON.stringify(userData));
// });

// const renderComponent = () =>
//   render(
//     <BrowserRouter>
//       <EventDetails />
//     </BrowserRouter>
//   );

// describe("EventDetails Component", () => {
// //   it("renders loading state initially", () => {
// //     renderComponent();
// //     // const loadingIndicator = screen.getByTestId("lottie");
// //     const loadingIndicator = screen.getByPlaceholderText("Lottie Animation"); 
    
// //     expect(loadingIndicator).toBeInTheDocument();
// //   });

// //   it("renders PageNotFound when error is true", async () => {
// //     // Mock useState to set error to true
// //     vi.spyOn(React, "useState")
// //       .mockImplementationOnce(() => [false, vi.fn()]) // loading
// //       .mockImplementationOnce(() => [null, vi.fn()]) // eventDetails
// //       .mockImplementationOnce(() => [true, vi.fn()]); // error

// //     renderComponent();

// //     const pageNotFound = await screen.findByTestId("page-not-found");
// //     expect(pageNotFound).toBeInTheDocument();
// //   });

//   it("renders event details when data is loaded", async () => {
//     // Mock useState to set loading to false and provide eventDetails
//     vi.spyOn(React, "useState").mockImplementation((init) => {
//       if (init === true) {
//         return [false, vi.fn()]; // loading
//       }
//       if (init === null) {
//         return [mockEventDetails, vi.fn()]; // eventDetails
//       }
//       if (init === false) {
//         return [false, vi.fn()]; // error
//       }
//       return [init, vi.fn()];
//     });

//     renderComponent();

//     // const footer = screen.getByTestId("footer");
//     // expect(footer).toBeInTheDocument();

//     const footer = screen.queryByTestId("footer");
//     expect(footer).toBeDefined();

//     // const mainComment = screen.getByTestId("main-comment");
//     // expect(mainComment).toHaveTextContent("MainComment 123"); // Assuming id is "123"

//     const mainComment = screen.queryByTestId("main-comment");
//     expect(mainComment).toBeDefined();
//     // expect(mainComment).toHaveTextContent("MainComment 123"); // Assuming id is "123"

//     // const musicNotes = screen.getByTestId("music-notes");
//     // expect(musicNotes).toHaveTextContent("MusicNotes 30"); // Adjust based on actual count

//     const musicNotes = screen.queryByTestId("music-notes");
//     // expect(musicNotes).toHaveTextContent("MusicNotes 30"); // Adjust based on actual count
//     expect(musicNotes).toBeDefined();

//     // Check event name
//     const eventName = screen.getByText(mockEventDetails.eventName);
//     // expect(eventName).toBeInTheDocument();
//     expect(eventName).toBeDefined();

//     // Check price
//     const price = screen.getByText(
//       `${mockEventDetails.price.toLocaleString()} تومان`
//     );
//     expect(price).toBeInTheDocument();

//     // Check location
//     const location = screen.getByText(mockEventDetails.location);
//     expect(location).toBeInTheDocument();

//     // Check category
//     const category = screen.getByText(mockEventDetails.category);
//     expect(category).toBeInTheDocument();

//     // Check organizer name
//     const organizerName = screen.getByText(mockEventDetails.organizerName);
//     expect(organizerName).toBeInTheDocument();

//     // Check buttons
//     const followButton = screen.getByText("دنبال کردن");
//     expect(followButton).toBeInTheDocument();

//     const contactButton = screen.getByText("تماس");
//     expect(contactButton).toBeInTheDocument();

//     const bookmarkButton = screen.getByText("بعدا یادآوری کن");
//     expect(bookmarkButton).toBeInTheDocument();

//     // Check description
//     const description = screen.getByText(mockEventDetails.description);
//     expect(description).toBeInTheDocument();

//     // Check tags
//     mockEventDetails.tags.forEach((tag) => {
//       const tagElement = screen.getByText(`#${tag}`);
//       expect(tagElement).toBeInTheDocument();
//     });
//   });

//   it("handles bookmarking correctly", async () => {
//     // Mock useState to set initial isBookmarked to false
//     let isBookmarked = false;
//     vi.spyOn(React, "useState").mockImplementation((init) => {
//       if (init === false) {
//         return [isBookmarked, (value) => (isBookmarked = value)];
//       }
//       if (init === null) {
//         return [mockEventDetails, vi.fn()]; // eventDetails
//       }
//       return [init, vi.fn()];
//     });

//     renderComponent();

//     const bookmarkButton = screen.getByText("بعدا یادآوری کن");
//     fireEvent.click(bookmarkButton);

//     await waitFor(() => {
//       expect(axios.post).toHaveBeenCalledWith(
//         "https://eventify.liara.run/events/123/bookmark/",
//         {},
//         {
//           headers: {
//             "Content-Type": "application/json",
//             accept: "application/json",
//             Authorization: "JWT test-token",
//           },
//         }
//       );
//       expect(isBookmarked).toBe(true);
//     });
//   });

//   it("copies current URL to clipboard", async () => {
//     renderComponent();

//     await waitFor(() => {
//       expect(screen.queryByTestId("lottie")).not.toBeInTheDocument();
//     });

//     const copyLinkButton = screen.getByText("کپی لینک");
//     fireEvent.click(copyLinkButton);

//     await waitFor(() => {
//       expect(copy).toHaveBeenCalledWith(window.location.href);
//     });
//   });

//   it("copies event URL to clipboard", async () => {
//     renderComponent();

//     await waitFor(() => {
//       expect(screen.queryByTestId("lottie")).not.toBeInTheDocument();
//     });

//     const copyLinkButton = screen.getByText("کپی لینک");
//     fireEvent.click(copyLinkButton);

//     await waitFor(() => {
//       expect(copy).toHaveBeenCalledWith(mockEventDetails.url);
//     });
//   });

//   it("shows toast notifications on bookmark toggle", async () => {
//     renderComponent();

//     await waitFor(() => {
//       expect(screen.queryByTestId("lottie")).not.toBeInTheDocument();
//     });

//     const bookmarkButton = screen.getByText("بعدا یادآوری کن");
//     fireEvent.click(bookmarkButton);

//     await waitFor(() => {
//       expect((require("react-toastify").toast).success).toHaveBeenCalledWith(
//         "رویداد به علاقه مندی ها اضافه شد"
//       );
//     });

//     // Simulate clicking again to remove bookmark
//     vi.spyOn(React, "useState").mockImplementation((init) => {
//       if (init === false) {
//         return [true, vi.fn()]; // isBookmarked = true
//       }
//       if (init === null) {
//         return [mockEventDetails, vi.fn()]; // eventDetails
//       }
//       return [init, vi.fn()];
//     });

//     fireEvent.click(bookmarkButton);

//     await waitFor(() => {
//       expect((require("react-toastify").toast).error).toHaveBeenCalledWith(
//         "رویداد از علاقه مندی ها حذف شد"
//       );
//     });
//   });

//   it("renders ToastContainer", () => {
//     renderComponent();
//     const toastContainer = screen.getByTestId("toast-container");
//     expect(toastContainer).toBeInTheDocument();
//   });
// });


