import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

const loadComponent = async (apiKey?: string) => {
  vi.resetModules();
  vi.doMock("../../lib/env", () => ({ GOOGLE_MAPS_API_KEY: apiKey }));
  const module = await import("./GoogleMap");
  return module.default;
};

type MockListenerMap = Record<string, Array<(...args: any[]) => void>>;

class MockMap {
  static created: MockMap[] = [];
  listeners: MockListenerMap = {};
  options: unknown;

  constructor(_node: HTMLElement, options: unknown) {
    this.options = options;
    MockMap.created.push(this);
  }

  addListener(event: string, cb: (...args: any[]) => void) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event]?.push(cb);
    return { remove: vi.fn() };
  }

  trigger(event: string, payload: any) {
    this.listeners[event]?.forEach((cb) => cb(payload));
  }

  setCenter = vi.fn();
  setZoom = vi.fn();
}

class MockMarker {
  static created: MockMarker[] = [];
  listeners: MockListenerMap = {};
  options: unknown;
  constructor(options: unknown) {
    this.options = options;
    MockMarker.created.push(this);
  }
  addListener(event: string, cb: (...args: any[]) => void) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event]?.push(cb);
    return { remove: vi.fn() };
  }
  trigger(event: string, payload?: any) {
    this.listeners[event]?.forEach((cb) => cb(payload));
  }
  setMap = vi.fn();
}

class MockSize {
  constructor(public width: number, public height: number) {}
}
class MockPoint {
  constructor(public x: number, public y: number) {}
}
class MockLatLng {
  constructor(public lat: number, public lng: number) {}
}

const installGoogleStub = () => {
  (globalThis as any).google = {
    maps: {
      Map: MockMap,
      Marker: MockMarker,
      Point: MockPoint,
      Size: MockSize,
      LatLng: MockLatLng,
      MapTypeId: {
        ROADMAP: "roadmap",
      },
    },
  };
};

describe("GoogleMap (fallback)", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    MockMap.created = [];
    MockMarker.created = [];
    delete (globalThis as any).google;
  });

  it("renders loading state when not yet loaded (API key configured)", async () => {
    const GoogleMap = await loadComponent("test-api-key");
    render(<GoogleMap className="h-64" />);
    expect(screen.getByText(/Loading map/i)).toBeInTheDocument();
  });

  it("shows configuration hint when API key is missing", async () => {
    const GoogleMap = await loadComponent(undefined);
    render(<GoogleMap className="h-64" />);
    expect(
      screen.getByText(/Configure VITE_GOOGLE_MAPS_API_KEY/i)
    ).toBeInTheDocument();
  });

  it("creates map and markers when Google Maps is available", async () => {
    installGoogleStub();
    const onMapClick = vi.fn();
    const onMarkerClick = vi.fn();
    const markerOnClick = vi.fn();
    const GoogleMap = await loadComponent("test-api-key");

    render(
      <GoogleMap
        className="h-64"
        mapStyle="minimal"
        markers={[
          { id: "1", position: { lat: 1, lng: 2 }, icon: "X", onClick: markerOnClick },
          { id: "2", position: { lat: 3, lng: 4 }, title: "Marker 2" },
        ]}
        onMapClick={onMapClick}
        onMarkerClick={onMarkerClick}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("google-map")).toBeInTheDocument();
    });

    // Map is instantiated with provided options
    expect(MockMap.created).toHaveLength(1);

    // Trigger map click listener
    MockMap.created[0].trigger("click", { type: "click" });
    expect(onMapClick).toHaveBeenCalledTimes(1);

    // Markers are added and click handlers chain
    expect(MockMarker.created).toHaveLength(2);
    MockMarker.created[0].trigger("click");
    expect(markerOnClick).toHaveBeenCalledTimes(1);
    expect(onMarkerClick).toHaveBeenCalledTimes(1);
  });
});
