import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, test, vi } from "vitest";

import Homepage from "../Homepage";
import { DOWNLOAD_URL } from "../../lib/env";

describe("Homepage hero smoke test", () => {
  test("hero renders copy and CTA actions behave", async () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => window);
    window.location.hash = "";

    const user = userEvent.setup();
    render(<Homepage />);

    expect(
      await screen.findByRole("heading", {
        name: /Connect Anonymously, Speak Freely/i,
      })
    ).toBeInTheDocument();

    const hero = screen.getByTestId("homepage-hero");
    expect(hero).toHaveAttribute("aria-labelledby", "home-hero-title");
    expect(document.getElementById("home-hero-title")).not.toBeNull();

    const getStarted = screen.getByRole("button", { name: /Get Started/i });
    const howItWorks = screen.getByRole("button", { name: /How It Works/i });
    const download = screen.getByRole("button", { name: /Download App/i });

    await user.click(getStarted);
    expect(window.location.hash).toBe("#get-started");

    const howItWorksSection = document.getElementById("how-it-works");
    const scroll = vi.fn();
    if (howItWorksSection) {
      Object.defineProperty(howItWorksSection, "scrollIntoView", {
        value: scroll,
        configurable: true,
        writable: true,
      });
    }

    await user.click(howItWorks);
    expect(window.location.hash).toBe("#how-it-works");
    if (howItWorksSection) {
      expect(scroll).toHaveBeenCalled();
    }

    await user.click(download);
    expect(openSpy).toHaveBeenCalledWith(DOWNLOAD_URL, "_blank", "noopener");

    expect(consoleError).not.toHaveBeenCalled();

    consoleError.mockRestore();
    openSpy.mockRestore();
  });

  test("hero CTA buttons expose focus-visible styles and label wiring", async () => {
    render(<Homepage />);

    const hero = await screen.findByTestId("homepage-hero");
    const headingId = hero.getAttribute("aria-labelledby");
    expect(headingId).toBe("home-hero-title");
    expect(document.getElementById(headingId!)).toBeTruthy();

    const ctas = screen
      .getAllByRole("button")
      .filter((button) => button.hasAttribute("data-cta"));

    expect(ctas).toHaveLength(3);
    ctas.forEach((button) => {
      expect(button.classList.contains("focus-ring")).toBe(true);
      expect(button.className).toContain("focus-visible:outline");
      expect(button.className).toContain("focus-visible:outline-2");
      expect(button.className).toContain("focus-visible:outline-offset-2");
    });
  });
});
