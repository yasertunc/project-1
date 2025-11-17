import { render, screen } from "@testing-library/react";
import React from "react";
import { expect } from "vitest";

import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders with default alt text when none provided", () => {
    render(<Logo data-testid="brand-logo" />);
    expect(screen.getByTestId("brand-logo")).toHaveAttribute(
      "alt",
      "Fellowus logo"
    );
  });

  it("allows overriding the accessible label", () => {
    render(<Logo alt="Alternate logo" aria-label="Alternate logo" size={48} />);
    const image = screen.getByRole("img", { name: "Alternate logo" });
    expect(image).toHaveAttribute("width", "48");
  });
});
