import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { Button } from "./Button";
import { Input } from "./Input";
import { ChatBubble } from "./ChatBubble";
import { Chip } from "./Chip";
import { MicButton } from "./MicButton";
import { MoodAvatar } from "./MoodAvatar";
import { ReportBubble } from "./ReportBubble";
import { ReportCategoryModal } from "./ReportCategoryModal";
import { SuggestionCard } from "./SuggestionCard";
import { ErrorBoundary } from "./ErrorBoundary";
import { describe, expect, it, vi } from "vitest";

describe("Button", () => {
  it("uses default aria-label fallback when no text provided", () => {
    render(<Button aria-label={undefined} />);
    const button = screen.getByRole("button", { name: "Button" });
    expect(button).toBeInTheDocument();
  });

  it("renders children and variant classes", () => {
    render(<Button variant="outline">Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button.className).toMatch(/outline/i);
  });
});

describe("Input", () => {
  it("shows label, placeholder, and error text", () => {
    render(
      <Input
        label="Email"
        placeholder="you@example.com"
        error="This field is required"
        leftIcon={<span>★</span>}
      />
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});

describe("ChatBubble", () => {
  it("renders system messages with tertiary styling", () => {
    render(<ChatBubble author="system">System notice</ChatBubble>);
    expect(screen.getByText(/system notice/i)).toBeInTheDocument();
  });

  it("aligns self messages on the right", () => {
    render(<ChatBubble author="me">Hello</ChatBubble>);
    const bubble = screen.getByText("Hello");
    expect(bubble.className).toMatch(/ml-auto/);
  });
});

describe("Chip", () => {
  it("applies selected styling when selected", () => {
    render(<Chip selected>Tagged</Chip>);
    const chip = screen.getByRole("button", { name: /tagged/i });
    expect(chip.className).toMatch(/primary/);
  });
});

describe("MicButton", () => {
  it("shows idle and recording states with aria-pressed", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<MicButton recording={false} />);
    const button = screen.getByRole("button", { name: /voice command/i });
    expect(button).toHaveAttribute("aria-pressed", "false");

    rerender(<MicButton recording={true} />);
    expect(screen.getByRole("button", { name: /recording/i })).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    const onPress = vi.fn();
    const onRelease = vi.fn();
    rerender(
      <MicButton recording={false} onPress={onPress} onRelease={onRelease} />
    );
    const pressable = screen.getByRole("button", { name: /voice command/i });
    await user.pointer([{ target: pressable, keys: "[MouseLeft]" }]);
    expect(onPress).toHaveBeenCalled();
  });
});

describe("MoodAvatar", () => {
  it("cycles mood when clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodAvatar mood="neutral" onChange={onChange} />);
    const btn = screen.getByRole("button", { name: /Mood: neutral/i });
    await user.click(btn);
    expect(onChange).toHaveBeenCalledWith("happy");
  });
});

describe("ReportBubble", () => {
  it("renders with translated label and fires click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ReportBubble onClick={onClick} />);
    const btn = screen.getByRole("button", { name: /report/i });
    await user.click(btn);
    expect(onClick).toHaveBeenCalled();
  });
});

describe("ReportCategoryModal", () => {
  it("lists categories and handles selection", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onClose = vi.fn();
    render(<ReportCategoryModal open onClose={onClose} onSelect={onSelect} />);
    const dialog = screen.getByRole("dialog", { name: /report/i });
    expect(dialog).toBeInTheDocument();
    const harassment = screen.getByRole("button", {
      name: /harassment/i,
    });
    await user.click(harassment);
    expect(onSelect).toHaveBeenCalledWith("harassment");
  });
});

describe("SuggestionCard", () => {
  it("renders CTA buttons and invokes callbacks", async () => {
    const user = userEvent.setup();
    const primary = vi.fn();
    const secondary = vi.fn();
    render(
      <SuggestionCard
        title="Try this"
        meta="Meta"
        primaryCta={{ label: "Go", onClick: primary }}
        secondaryCta={{ label: "Skip", onClick: secondary }}
      >
        Body
      </SuggestionCard>
    );
    await user.click(screen.getByRole("button", { name: "Go" }));
    await user.click(screen.getByRole("button", { name: "Skip" }));
    expect(primary).toHaveBeenCalled();
    expect(secondary).toHaveBeenCalled();
  });
});

describe("ErrorBoundary", () => {
  it("renders fallback when child throws", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const Failing: React.FC = () => {
      throw new Error("boom");
    };
    const onError = vi.fn();
    render(
      <ErrorBoundary
        fallback={<div data-testid="fallback">Fallback</div>}
        onError={onError}
      >
        <Failing />
      </ErrorBoundary>
    );
    expect(screen.getByTestId("fallback")).toBeInTheDocument();
    expect(onError).toHaveBeenCalled();
    consoleError.mockRestore();
  });
});
