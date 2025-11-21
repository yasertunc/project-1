import { describe, expect, it, vi } from "vitest";

import { EventBus } from "./EventBus";

describe("EventBus", () => {
  it("emits to subscribers and removes on unsubscribe", () => {
    const bus = new EventBus<number>();
    const handler = vi.fn();
    const unsub = bus.on(handler);

    bus.emit(1);
    unsub();
    bus.emit(2);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(1);
  });

  it("clears all listeners", () => {
    const bus = new EventBus<string>();
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    bus.on(handler1);
    bus.on(handler2);

    bus.clear();
    bus.emit("noop");

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });
});
