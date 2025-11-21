import { renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { useI18n } from "./useI18n";

describe("useI18n", () => {
  test("returns translation function and i18n instance", () => {
    const { result } = renderHook(() => useI18n());

    expect(result.current).toHaveProperty("t");
    expect(result.current).toHaveProperty("i18n");
    expect(typeof result.current.t).toBe("function");
    expect(result.current.i18n).toBeDefined();
  });

  test("uses 'common' namespace by default", () => {
    const { result } = renderHook(() => useI18n());

    // Should be able to translate common namespace keys
    expect(result.current.t("app.name")).toBeDefined();
  });
});
