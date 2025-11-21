import { act, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./homepage/HowItWorks", () => ({
  __esModule: true,
  default: () => <div data-testid="how-it-works">How it works</div>,
}));
vi.mock("./homepage/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

import Homepage from "./Homepage";

describe("Homepage container", () => {
  afterEach(() => {
    delete (window as unknown as { __FELLOWUS_FORCE_SECTION_ERROR?: string[] })
      .__FELLOWUS_FORCE_SECTION_ERROR;
    delete (
      window as unknown as {
        IntersectionObserver?: typeof IntersectionObserver;
      }
    ).IntersectionObserver;
    vi.restoreAllMocks();
  });

  it("renders hero and lazy section skeletons by default", () => {
    render(<Homepage />);
    expect(
      screen.getByRole("heading", { name: /fellowus/i })
    ).toBeInTheDocument();
    // Initially shows skeletons while observers haven't fired
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });

  it("surfaces a section error when guards force a failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    (
      window as unknown as { __FELLOWUS_FORCE_SECTION_ERROR?: string[] }
    ).__FELLOWUS_FORCE_SECTION_ERROR = ["features"];
    render(<Homepage />);
    expect(await screen.findByTestId("section-error")).toBeInTheDocument();
  });

  it("renders feature cards once visibility triggers", async () => {
    const callbacks: Array<(entries: IntersectionObserverEntry[]) => void> = [];
    class MockIntersectionObserver {
      callback: (entries: IntersectionObserverEntry[]) => void;
      constructor(cb: (entries: IntersectionObserverEntry[]) => void) {
        this.callback = cb;
        callbacks.push(cb);
      }
      observe() {}
      disconnect() {}
    }
    (
      window as unknown as {
        IntersectionObserver?: typeof IntersectionObserver;
      }
    ).IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;

    render(<Homepage />);
    await act(async () => {
      callbacks.forEach((cb) =>
        cb([{ isIntersecting: true } as IntersectionObserverEntry])
      );
    });

    const features = await screen.findAllByTestId(/feature-/);
    expect(features.length).toBeGreaterThan(0);
  });
});
