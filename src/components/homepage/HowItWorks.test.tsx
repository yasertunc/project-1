import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import Homepage from "../Homepage";
import HowItWorks from "./HowItWorks";

describe("HowItWorks", () => {
  it("renders heading and descriptive copy with matching aria-labelledby", () => {
    render(<HowItWorks />);
    const section = screen.getByRole("region", {
      name: /three easy steps/i,
    });
    expect(section).toHaveAttribute("aria-labelledby", "how-it-works-title");
    const heading = screen.getByRole("heading", {
      level: 2,
      name: /three easy steps/i,
    });
    expect(heading.id).toBe("how-it-works-title");
  });

  it("scrolls into view when triggered from the hero CTA", async () => {
    const user = userEvent.setup();
    render(<Homepage />);

    const target = document.getElementById("how-it-works");
    const scroll = vi.fn();
    if (target) {
      Object.defineProperty(target, "scrollIntoView", {
        value: scroll,
        configurable: true,
        writable: true,
      });
    }

    const howItWorksButton = await screen.findByRole("button", {
      name: /How It Works/i,
    });

    await user.click(howItWorksButton);

    expect(window.location.hash).toBe("#how-it-works");
    if (target) {
      expect(scroll).toHaveBeenCalled();
    }
  });
});
