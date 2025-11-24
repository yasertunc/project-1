import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent, expect } from "@storybook/test";

import AppPhoneMock, {
  type AppPhoneMockProps,
  type PageId,
} from "../components/AppPhoneMock";

const meta: Meta<typeof AppPhoneMock> = {
  title: "Fellowus/Mobile/AppPhoneMock",
  component: AppPhoneMock,
  parameters: { layout: "centered" },
  args: {
    initialPage: "map",
    showAIAssistant: true,
    showMessageInput: true,
  },
  argTypes: {
    initialPage: {
      control: {
        type: "select",
      },
      options: [
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
      ],
    },
    showAIAssistant: { control: "boolean" },
    showMessageInput: { control: "boolean" },
  },
};
export default meta;

type Story = StoryObj<typeof AppPhoneMock>;

export const InteractiveFlow: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Render default map view", async () => {
      await expect(
        canvas.getByRole("button", { name: "MAP" })
      ).toBeInTheDocument();
      // AI Assistant button exists but without aria-label
      await expect(canvas.getByText("AI")).toBeInTheDocument();
    });

    await step("Switch to chat section", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "CHAT" }));
      // Check for chat content instead of specific message
      await expect(canvas.getByText("Merhaba")).toBeInTheDocument();
    });

    await step("Open VIP advantages", async () => {
      const vipButtons = canvas.getAllByRole("button", { name: "VIP" });
      await userEvent.click(vipButtons[0]);
      // Check for VIP content without title
      await expect(canvas.getByText("Unlimited Matches")).toBeInTheDocument();
    });

    await step("Open settings panel", async () => {
      const settingsButtons = canvas.getAllByRole("button", { name: "⚙" });
      await userEvent.click(settingsButtons[0]);
      await expect(canvas.getByText("Account")).toBeInTheDocument();
    });
  },
};

const pageStory = (
  page: PageId,
  overrides?: Partial<AppPhoneMockProps>
): Story => ({
  args: {
    initialPage: page,
    ...overrides,
  },
});

export const MapOverview = pageStory("map");
export const PlacesCatalog = pageStory("places");
export const Filters = pageStory("filter");
export const Categories = pageStory("categories");
export const Profile = pageStory("profile");
export const Chat = pageStory("chat");
export const Groups = pageStory("groups");
export const Social = pageStory("social");
export const Notifications = pageStory("notifications");
export const VipUpsell = pageStory("vip", { showMessageInput: false });
export const Settings = pageStory("settings", { showMessageInput: false });
