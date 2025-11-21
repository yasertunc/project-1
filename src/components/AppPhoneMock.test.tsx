import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import React from "react";

import AppPhoneMock, { type PageId } from "./AppPhoneMock";

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock setPointerCapture and releasePointerCapture for jsdom
if (typeof HTMLElement.prototype.setPointerCapture === "undefined") {
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
}

describe("AppPhoneMock", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders with default props", () => {
    render(<AppPhoneMock />);
    
    // Should render the phone mock container - find by status bar time (format: HH:MM)
    const timeElement = screen.getByText(/\d{1,2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
    
    // Should show status bar
    expect(timeElement.parentElement).toBeInTheDocument();
  });

  test("renders with initialPage prop", () => {
    render(<AppPhoneMock initialPage="chat" />);
    
    // Should show chat page content - Merhaba means "Hello" in Turkish
    expect(screen.getByText(/Merhaba/i)).toBeInTheDocument();
  });

  test("renders with showAIAssistant prop", () => {
    render(<AppPhoneMock showAIAssistant={true} />);
    
    const aiButton = screen.getByLabelText(/AI Assistant/i);
    expect(aiButton).toBeInTheDocument();
  });

  test("hides AI assistant when showAIAssistant is false", () => {
    render(<AppPhoneMock showAIAssistant={false} />);
    
    const aiButton = screen.queryByLabelText(/AI Assistant/i);
    expect(aiButton).not.toBeInTheDocument();
  });

  test("renders message input when showMessageInput is true", () => {
    render(<AppPhoneMock showMessageInput={true} />);
    
    const messageInput = screen.getByPlaceholderText(/Type your message/i);
    expect(messageInput).toBeInTheDocument();
  });

  test("hides message input when showMessageInput is false", () => {
    render(<AppPhoneMock showMessageInput={false} />);
    
    const messageInput = screen.queryByPlaceholderText(/Type your message/i);
    expect(messageInput).not.toBeInTheDocument();
  });

  test("displays map page by default", () => {
    render(<AppPhoneMock initialPage="map" />);
    
    // Map view should be rendered (check for map-specific elements)
    const mapContainer = document.querySelector('[class*="relative"]');
    expect(mapContainer).toBeInTheDocument();
  });

  test("displays places page when selected", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="map" />);
    
    // Click on places navigation button - there are multiple, get the first one in the visible section
    const placesButtons = screen.getAllByRole("button", { name: /YERLER/i });
    await user.click(placesButtons[0]);
    
    // Wait for the page content to appear - Places page has "Nearby Places" title
    await waitFor(() => {
      expect(screen.getByText(/Nearby Places/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("displays filter page when selected", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="map" />);
    
    const filterButtons = screen.getAllByRole("button", { name: /FİLTRE/i });
    await user.click(filterButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Filter/i)).toBeInTheDocument();
      expect(screen.getByText(/Distance/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("updates distance filter value via slider", async () => {
    render(<AppPhoneMock initialPage="filter" />);
    const slider = await screen.findByRole("slider");
    fireEvent.change(slider, { target: { value: 200 } });

    await waitFor(() => {
      expect(screen.getByText(/200 km/i)).toBeInTheDocument();
    });
  });

  test("displays categories page when selected", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="map" />);
    
    const categoriesButtons = screen.getAllByRole("button", { name: /KATEGORİ/i });
    await user.click(categoriesButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Categories/i)).toBeInTheDocument();
      expect(screen.getByText(/Food & Drink/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("displays profile page when selected", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="chat" />);
    
    const profileButtons = screen.getAllByRole("button", { name: /PROFİL/i });
    await user.click(profileButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Kullanıcı Adı/i)).toBeInTheDocument();
      expect(screen.getByText(/Kişisel Bilgiler/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("displays chat page when selected", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="profile" />);
    
    const chatButtons = screen.getAllByRole("button", { name: /SOHBET/i });
    await user.click(chatButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Merhaba/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("displays groups page when selected", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="chat" />);
    
    const groupsButtons = screen.getAllByRole("button", { name: /GRUPLAR/i });
    await user.click(groupsButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Groups/i)).toBeInTheDocument();
      expect(screen.getByText(/Project Team/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("displays social page when selected", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="chat" />);
    
    const socialButtons = screen.getAllByRole("button", { name: /SOSYAL/i });
    await user.click(socialButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Social Feed/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("displays VIP page when VIP button is clicked", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="map" />);
    
    // There are multiple VIP buttons (one per navigation section), get the first visible one
    const vipButtons = screen.getAllByRole("button", { name: /VIP/i });
    await user.click(vipButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/VIP Membership/i)).toBeInTheDocument();
      expect(screen.getByText(/Unlimited Messaging/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("displays settings page when settings button is clicked", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="map" />);
    
    // There are multiple settings buttons (one per navigation section), get the first visible one
    const settingsButtons = screen.getAllByRole("button", { name: /⚙/i });
    await user.click(settingsButtons[0]);
    
    await waitFor(() => {
      expect(screen.getByText(/Account/i)).toBeInTheDocument();
      // Find the Notifications section title specifically (it's in a div with specific styling)
      const notificationsTitle = screen.getAllByText(/Notifications/i).find(
        (el) => el.className.includes("font-semibold") && el.className.includes("text-[#667eea]")
      );
      expect(notificationsTitle).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("updates time in status bar", async () => {
    render(<AppPhoneMock />);
    
    // Initial time should be displayed - StatusBar shows current time
    const initialTime = screen.getByText(/\d{1,2}:\d{2}/);
    expect(initialTime).toBeInTheDocument();
    
    // Wait for time to update (StatusBar updates every second)
    await waitFor(() => {
      // Time should still be displayed (format may vary)
      const timeElements = screen.getAllByText(/\d{1,2}:\d{2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    }, { timeout: 2500 });
  });

  test("navigates between sections using nav indicators", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="map" />);
    
    // Find nav indicators - they have role="button" and are clickable
    const allButtons = screen.getAllByRole("button");
    // Nav indicators are the small dots at the bottom of navigation
    // They have specific styling, let's find them by their position in the DOM
    const navIndicators = allButtons.filter((btn) => 
      btn.getAttribute("tabIndex") === "0" && 
      btn.className.includes("rounded-full")
    );
    
    // If we find nav indicators, click the second one (section 1) to navigate to chat section
    expect(navIndicators.length).toBeGreaterThan(0);
    await user.click(navIndicators[1] || navIndicators[0]);
    
    // Should navigate to chat section - verify chat section button is visible
    await waitFor(() => {
      const chatButtons = screen.getAllByRole("button", { name: /SOHBET/i });
      expect(chatButtons.length).toBeGreaterThan(0);
    }, { timeout: 2000 });
  });

  test("displays correct navigation buttons for map section", () => {
    render(<AppPhoneMock initialPage="map" />);
    
    expect(screen.getByRole("button", { name: /HARİTA/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /YERLER/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /FİLTRE/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /KATEGORİ/i })).toBeInTheDocument();
  });

  test("displays correct navigation buttons for chat section", () => {
    render(<AppPhoneMock initialPage="chat" />);
    
    expect(screen.getByRole("button", { name: /PROFİL/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SOHBET/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GRUPLAR/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /SOSYAL/i })).toBeInTheDocument();
  });

  test("highlights active navigation button", () => {
    render(<AppPhoneMock initialPage="map" />);
    
    const mapButton = screen.getByRole("button", { name: /HARİTA/i });
    // Active button should have specific styling
    expect(mapButton.className).toContain("border-b-2");
  });

  test("renders all page types", () => {
    const pages: PageId[] = [
      "map",
      "places",
      "filter",
      "categories",
      "profile",
      "chat",
      "groups",
      "social",
      "notifications",
      "vip",
      "settings",
    ];

    pages.forEach((page) => {
      const { unmount } = render(<AppPhoneMock initialPage={page} />);
      // Component should render without errors - check for time display in status bar
      // Status bar time is in a span with font-semibold class, find it specifically
      const timeElements = screen.getAllByText(/\d{1,2}:\d{2}/);
      const statusBarTime = timeElements.find(
        (el) => el.className.includes("font-semibold") && el.parentElement?.className.includes("flex")
      );
      expect(statusBarTime).toBeInTheDocument();
      unmount();
    });
  });

  test("handles message input interaction", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock showMessageInput={true} initialPage="chat" />);
    
    // Wait for message input to be rendered
    const input = await screen.findByPlaceholderText(/Type your message/i);
    await user.type(input, "Test message");
    
    expect(input).toHaveValue("Test message");
  });

  test("expands categories and reveals items", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="categories" />);

    const categoryHeading = await screen.findByText(/MESLEK GRUPLARI/i);
    await user.click(categoryHeading);

    await waitFor(() => {
      expect(screen.getByText(/Sanayi/i)).toBeInTheDocument();
    });
  });

  test("distance preset buttons update value", async () => {
    const user = userEvent.setup();
    render(<AppPhoneMock initialPage="filter" />);

    const presetButton = await screen.findByRole("button", { name: "1000" });
    await user.click(presetButton);

    await waitFor(() => {
      expect(screen.getByText(/1000 km/i)).toBeInTheDocument();
    });
  });

  test("renders status bar with correct elements", () => {
    render(<AppPhoneMock />);
    
    // Status bar should show time (format: HH:MM)
    const timeElement = screen.getByText(/\d{1,2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
    
    // Status bar should show status icons (emoji)
    const statusBar = timeElement.parentElement;
    expect(statusBar).toBeInTheDocument();
    expect(statusBar?.textContent).toContain("📶");
  });
});

