import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import DesignPrinciples from "./DesignPrinciples";

describe("DesignPrinciples", () => {
  test("renders main heading", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Temel Tasarım Prensipleri")).toBeInTheDocument();
  });

  test("renders foundation badge", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText(/Fellowus · Foundations/i)).toBeInTheDocument();
  });

  test("renders description text", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText(/Storybook hikâyeleri/i)).toBeInTheDocument();
  });

  test("renders color system section", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Renk Sistemi")).toBeInTheDocument();
    expect(screen.getByText(/Gradientler ve yüzeyler/i)).toBeInTheDocument();
  });

  test("renders color swatches", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Primary Gradient")).toBeInTheDocument();
    expect(screen.getByText("VIP Gradient")).toBeInTheDocument();
    expect(screen.getByText("Surface / White")).toBeInTheDocument();
    expect(screen.getByText("Surface / Gray")).toBeInTheDocument();
    expect(screen.getByText("Background / Light")).toBeInTheDocument();
    expect(screen.getByText("Background / Medium")).toBeInTheDocument();
    expect(screen.getByText("Status / Online")).toBeInTheDocument();
    expect(screen.getByText("Status / Error")).toBeInTheDocument();
  });

  test("renders typography scale section", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Tipografi Ölçeği")).toBeInTheDocument();
    expect(
      screen.getByText(/Apple\/Google sistem fontları/i)
    ).toBeInTheDocument();
  });

  test("renders typography scale items", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Tiny")).toBeInTheDocument();
    expect(screen.getByText("Nav")).toBeInTheDocument();
  });

  test("renders spacing and radius section", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Spacing & Radius")).toBeInTheDocument();
    expect(screen.getByText(/4\/8\/12 ritmi/i)).toBeInTheDocument();
  });

  test("renders spacing tokens", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Spacing Tokens")).toBeInTheDocument();
  });

  test("renders radius tokens", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Radius Tokens")).toBeInTheDocument();
  });

  test("renders behavioral principles section", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Davranışsal Prensipler")).toBeInTheDocument();
    expect(screen.getByText(/Hareket, geri bildirim/i)).toBeInTheDocument();
  });

  test("renders principle cards", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText("Safety-first communication")).toBeInTheDocument();
    expect(screen.getByText("Legible motion & feedback")).toBeInTheDocument();
    expect(screen.getByText("Shared spatial rhythm")).toBeInTheDocument();
  });

  test("renders principle summaries", () => {
    render(<DesignPrinciples />);

    expect(
      screen.getByText(/Information density stays comfortable/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/All movement follows the shared easing curve/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Components snap to the 4\/8\/12 grid/i)
    ).toBeInTheDocument();
  });

  test("renders principle bullets", () => {
    render(<DesignPrinciples />);

    expect(screen.getByText(/Cards use medium shadow/i)).toBeInTheDocument();
    expect(screen.getByText(/Navigation swipe threshold/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Vertical stacks rely on 15px/i)
    ).toBeInTheDocument();
  });

  test("has proper structure with sections", () => {
    const { container } = render(<DesignPrinciples />);

    // Check for section structure
    const sections = container.querySelectorAll("section");
    expect(sections.length).toBeGreaterThan(0);
  });
});
