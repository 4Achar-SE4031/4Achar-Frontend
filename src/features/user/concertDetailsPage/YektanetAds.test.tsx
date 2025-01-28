import { render, screen, cleanup } from "@testing-library/react";
import { vi } from "vitest";
import YektanetAnalytics from "./YektanetAds";

// Mocking window properties for the test
beforeEach(() => {
  global.window = Object.create(window);
  Object.defineProperty(window, "yektanet", {
    value: vi.fn(),
    writable: true,
  });
  Object.defineProperty(window, "yektanetAnalyticsObject", {
    value: "yektanet",
    writable: true,
  });
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("YektanetAnalytics Component", () => {
  it("initializes Yektanet analytics script and link", () => {
    render(<YektanetAnalytics />);

    // Check if the yektanet function is initialized
    expect(window.yektanet).toBeDefined();
    expect(window.yektanetAnalyticsObject).toBe("yektanet");

    // Check if the preload link and script are added to the head
    const head = document.head;
    const preloadLink = head.querySelector("link[rel='preload']");
    const script = head.querySelector("script[src*='yn_pub.js']");

    expect(preloadLink).toBeInTheDocument();
    expect(script).toBeInTheDocument();
  });

  it("removes the Yektanet script and link on component unmount", () => {
    render(<YektanetAnalytics />);

    // Trigger unmount by cleaning up
    cleanup();

    // Check if the script and link are removed from the head
    const head = document.head;
    const preloadLink = head.querySelector("link[rel='preload']");
    const script = head.querySelector("script[src*='yn_pub.js']");

    expect(preloadLink).not.toBeInTheDocument();
    expect(script).not.toBeInTheDocument();
  });
});
