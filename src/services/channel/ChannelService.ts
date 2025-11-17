export type ChannelState = "idle" | "opening" | "open" | "error";

export interface ChannelOpenParams {
  matchId: string;
  channelId?: string;
  participants?: string[];
}

export interface ChannelService {
  state(): ChannelState;
  open(params: ChannelOpenParams): Promise<{ channelId: string }>;
  close(): Promise<void>;
  onState(cb: (s: ChannelState) => void): () => void;
}

export class MockChannelService implements ChannelService {
  private _state: ChannelState = "idle";
  private listeners = new Set<(s: ChannelState) => void>();

  state() {
    return this._state;
  }

  private emit(next: ChannelState) {
    this._state = next;
    this.listeners.forEach((listener) => listener(next));
  }

  onState(cb: (s: ChannelState) => void) {
    this.listeners.add(cb);
    cb(this._state);
    return () => this.listeners.delete(cb);
  }

  async open(params: ChannelOpenParams) {
    this.emit("opening");
    await new Promise((resolve) => setTimeout(resolve, 400));
    if (params.matchId.startsWith("fail")) {
      this.emit("error");
      throw new Error("CHANNEL_OPEN_FAILED");
    }
    this.emit("open");
    return {
      channelId:
        params.channelId ?? `ch_${Math.random().toString(36).slice(2, 8)}`,
    };
  }

  async close() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.emit("idle");
  }
}
