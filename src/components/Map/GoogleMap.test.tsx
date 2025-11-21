import { render, screen } from "@testing-library/react";
import React from "react";

import GoogleMap from "./GoogleMap";
import { GOOGLE_MAPS_API_KEY } from "../../lib/env";

describe("GoogleMap (fallback)", () => {
  it("renders loading state when not yet loaded (API key configured)", () => {
    (global as unknown as { GOOGLE_MAPS_API_KEY?: string }).GOOGLE_MAPS_API_KEY =
      GOOGLE_MAPS_API_KEY;
    render(<GoogleMap className="h-64" />);
    expect(screen.getByText(/Loading map/i)).toBeInTheDocument();
  });
});
