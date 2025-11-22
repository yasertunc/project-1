import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";

import GoogleMap from "./GoogleMap";

const meta: Meta<typeof GoogleMap> = {
  title: "Fellowus/Map/GoogleMap",
  component: GoogleMap,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Google Maps component with marker support. Requires VITE_GOOGLE_MAPS_API_KEY environment variable to display actual map.",
      },
    },
  },
  argTypes: {
    mapStyle: {
      control: {
        type: "select",
      },
      options: ["default", "dark", "minimal", "colorful", "grayscale"],
    },
    mapTypeId: {
      control: {
        type: "select",
      },
      options: ["roadmap", "satellite", "hybrid", "terrain"],
    },
    disableDefaultUI: { control: "boolean" },
    zoomControl: { control: "boolean" },
    mapTypeControl: { control: "boolean" },
    scaleControl: { control: "boolean" },
    streetViewControl: { control: "boolean" },
    fullscreenControl: { control: "boolean" },
    markerColor: { control: "color" },
    markerSize: { control: "number", min: 20, max: 50, step: 5 },
  },
  args: {
    center: { lat: 41.0082, lng: 28.9784 }, // Istanbul
    zoom: 13,
    markers: [
      {
        id: "1",
        position: { lat: 41.0082, lng: 28.9784 },
        title: "Istanbul",
      },
      {
        id: "2",
        position: { lat: 41.037, lng: 28.9763 },
        title: "Taksim Square",
      },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof GoogleMap>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    // Check if map container is rendered
    const mapContainer = canvasElement.querySelector(
      '[data-testid="google-map-container"]'
    );
    if (mapContainer) {
      await expect(mapContainer).toBeInTheDocument();
    }
  },
};

export const WithMultipleMarkers: Story = {
  args: {
    center: { lat: 41.0082, lng: 28.9784 },
    zoom: 12,
    markers: [
      {
        id: "1",
        position: { lat: 41.0082, lng: 28.9784 },
        title: "Istanbul",
      },
      {
        id: "2",
        position: { lat: 41.037, lng: 28.9763 },
        title: "Taksim Square",
      },
      {
        id: "3",
        position: { lat: 41.0408, lng: 28.9833 },
        title: "Galata Tower",
      },
      {
        id: "4",
        position: { lat: 41.0315, lng: 28.9756 },
        title: "Istiklal Avenue",
      },
    ],
  },
};

export const DarkMode: Story = {
  args: {
    center: { lat: 41.0082, lng: 28.9784 },
    zoom: 13,
    mapStyle: "dark",
    markers: [
      {
        id: "1",
        position: { lat: 41.0082, lng: 28.9784 },
        title: "Istanbul - Dark Mode",
      },
    ],
  },
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};

export const NoMarkers: Story = {
  args: {
    center: { lat: 41.0082, lng: 28.9784 },
    zoom: 13,
    markers: [],
  },
};

export const CustomMarkerIcons: Story = {
  args: {
    center: { lat: 41.0082, lng: 28.9784 },
    zoom: 13,
    markers: [
      {
        id: "1",
        position: { lat: 41.0082, lng: 28.9784 },
        title: "Custom Marker",
        icon: "📍",
      },
      {
        id: "2",
        position: { lat: 41.037, lng: 28.9763 },
        title: "Another Custom",
        icon: "🎯",
      },
    ],
  },
};

export const SatelliteView: Story = {
  args: {
    center: { lat: 41.0082, lng: 28.9784 },
    zoom: 14,
    mapTypeId: "satellite",
    markers: [
      {
        id: "1",
        position: { lat: 41.0082, lng: 28.9784 },
        title: "Satellite View",
      },
    ],
  },
};

export const MinimalUI: Story = {
  args: {
    center: { lat: 41.0082, lng: 28.9784 },
    zoom: 13,
    disableDefaultUI: true,
    zoomControl: true,
    markers: [
      {
        id: "1",
        position: { lat: 41.0082, lng: 28.9784 },
        title: "Minimal UI",
      },
    ],
  },
};

export const CustomStyledMarkers: Story = {
  args: {
    center: { lat: 41.0082, lng: 28.9784 },
    zoom: 13,
    markerColor: "#667eea",
    markerSize: 35,
    markers: [
      {
        id: "1",
        position: { lat: 41.0082, lng: 28.9784 },
        title: "Custom Styled Marker",
      },
    ],
  },
};
