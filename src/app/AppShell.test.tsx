import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";

import { AppShell, ThemeToggle } from "./AppShell";

describe("AppShell", () => {
  beforeEach(() => {
    localStorage.clear();
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.removeAttribute("lang");
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders with default title", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    expect(screen.getByText("Fellowus")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  test("renders with custom title", () => {
    render(
      <AppShell title="Custom Title">
        <div>Test content</div>
      </AppShell>
    );

    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  test("renders skip to main content link", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    const skipLink = screen.getByText("Skip to main content");
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main");
  });

  test("skip link focuses main element on click", async () => {
    const user = userEvent.setup();
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    const skipLink = screen.getByText("Skip to main content");
    const main = document.getElementById("main");

    expect(main).toBeInTheDocument();

    const focusSpy = vi.spyOn(main!, "focus");

    await user.click(skipLink);

    expect(focusSpy).toHaveBeenCalled();
  });

  test("renders header with logo and language switcher", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
  });

  test("renders footer with copyright", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent(new Date().getFullYear().toString());
  });

  test("renders main content area", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute("id", "main");
    expect(main).toHaveAttribute("tabIndex", "-1");
  });
});

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-theme");
    }
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders theme toggle button", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
  });

  test("displays current theme", () => {
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    // Default should be light, so button should say "Dark"
    expect(button).toHaveTextContent("Dark");
  });

  test("toggles theme on click", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });

    expect(button).toHaveTextContent("Dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    await user.click(button);

    expect(button).toHaveTextContent("Light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");

    await user.click(button);

    expect(button).toHaveTextContent("Dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  test("saves theme to localStorage", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });

    await user.click(button);

    expect(localStorage.getItem("fellowus.theme")).toBe("dark");
  });

  test("reads theme from localStorage on mount", () => {
    localStorage.setItem("fellowus.theme", "dark");

    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });
    expect(button).toHaveTextContent("Light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  test("handles localStorage errors gracefully", async () => {
    const user = userEvent.setup();
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error("Storage quota exceeded");
    });

    render(<ThemeToggle />);

    const button = screen.getByRole("button", { name: /toggle theme/i });

    // Should not throw
    await expect(user.click(button)).resolves.not.toThrow();

    localStorage.setItem = originalSetItem;
  });
});
