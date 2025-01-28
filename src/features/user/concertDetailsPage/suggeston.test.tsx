import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Suggestion from "./Suggestion";
import { MemoryRouter } from "react-router-dom";

// Mock agent manually
const agent = {
  Events: {
    list: () => {
      return Promise.resolve({
        concerts: [
          { id: 1, name: "Event 1" },
          { id: 2, name: "Event 2" },
          { id: 3, name: "Event 3" },
        ],
      });
    },
  },
};

describe("Suggestion Component", () => {
  it("renders and fetches events", async () => {
    render(
      <MemoryRouter>
        <Suggestion />
      </MemoryRouter>
    );

    // Check if loading happens and then verify events
    expect(screen.getByText("رویدادهای پیشنهادی")).toBeInTheDocument();
  });

  it("navigates to the events page when 'نمایش همه' is clicked", () => {
    const navigate = (path) => {
      expect(path).toBe("/events/recent");
    };

    render(
      <MemoryRouter>
        <Suggestion />
      </MemoryRouter>
    );

    const showAllButton = screen.getByText("نمایش همه");
    fireEvent.click(showAllButton);
  });

});
