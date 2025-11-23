import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import Hero from "./Hero";

describe("Hero (homepage)", () => {
  it("renders title, subtitle and CTA interaction", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Hero
        title="Welcome"
        subtitle="Subheading"
        ctaLabel="Get started"
        onCtaClick={onClick}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Welcome" })
    ).toBeInTheDocument();
    expect(screen.getByText("Subheading")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Get started" }));
    expect(onClick).toHaveBeenCalled();
  });
});
