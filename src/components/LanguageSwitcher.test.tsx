import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { LanguageSwitcher } from "./LanguageSwitcher";
import i18n from "../i18n/setup";

describe("LanguageSwitcher", () => {
  it("emits onChange and calls i18n.changeLanguage", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const changeSpy = vi
      .spyOn(i18n, "changeLanguage")
      .mockResolvedValue(i18n.t);

    render(<LanguageSwitcher value="en" onChange={onChange} />);

    const trButton = screen.getByRole("button", { name: /Switch to Turkish/i });
    await user.click(trButton);

    expect(onChange).toHaveBeenCalledWith("tr");
    expect(changeSpy).toHaveBeenCalledWith("tr");

    changeSpy.mockRestore();
  });
});
