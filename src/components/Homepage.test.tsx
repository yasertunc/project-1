import { render, screen } from "@testing-library/react";
import React from "react";

import Homepage from "./Homepage";

describe("Homepage container", () => {
  it("renders hero and lazy section skeletons by default", () => {
    render(<Homepage />);
    expect(screen.getByRole("heading", { name: /fellowus/i })).toBeInTheDocument();
    // Initially shows skeletons while observers haven't fired
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });
});
