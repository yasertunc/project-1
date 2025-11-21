import * as React from "react";

import type {
  ChannelService,
  ChannelState,
} from "../../services/channel/ChannelService";
import {
  ChannelFSM,
  type ChannelSnapshot,
} from "../../services/channel/ChannelFSM";
import { ChannelStatusBanner } from "./ChannelStatusBanner";
import { AcceptanceOffer } from "../Matching/AcceptanceOffer";

type BannerServiceAdapter = ChannelService & {
  update(snapshot: ChannelSnapshot): void;
};

const snapshotToChannelState = (snapshot: ChannelSnapshot): ChannelState => {
  switch (snapshot.phase) {
    case "awaiting_ack":
    case "opening":
      return "opening";
    case "open":
      return "open";
    case "error":
      return "error";
    default:
      return "idle";
  }
};

const createBannerService = (fsm: ChannelFSM): BannerServiceAdapter => {
  let current = snapshotToChannelState(fsm.getSnapshot());
  const listeners = new Set<(state: ChannelState) => void>();

  return {
    state() {
      return current;
    },
    async open() {
      const ctx = fsm.getSnapshot().ctx;
      return {
        channelId:
          ctx.channelId ??
          `pending-${ctx.matchId ?? Math.random().toString(36)}`,
      };
    },
    async close() {
      fsm.reset();
    },
    onState(callback) {
      listeners.add(callback);
      callback(current);
      return () => listeners.delete(callback);
    },
    update(snapshot) {
      const next = snapshotToChannelState(snapshot);
      if (next !== current) {
        current = next;
        listeners.forEach((listener) => listener(next));
      }
    },
  };
};

export const ChannelController: React.FC = () => {
  const fsm = React.useMemo(() => new ChannelFSM(), []);
  const [snapshot, setSnapshot] = React.useState<ChannelSnapshot>(
    fsm.getSnapshot(),
  );
  const bannerService = React.useMemo(() => createBannerService(fsm), [fsm]);

  React.useEffect(() => {
    const unsubscribe = fsm.subscribe((next) => {
      setSnapshot(next);
      bannerService.update(next);
    });
    return () => {
      unsubscribe();
    };
  }, [fsm, bannerService]);

  React.useEffect(() => {
    fsm.start();
    return () => {
      fsm.dispose();
    };
  }, [fsm]);

  const busy =
    snapshot.phase === "awaiting_ack" || snapshot.phase === "opening";

  return (
    <div className="grid w-[460px] gap-12">
      <ChannelStatusBanner svc={bannerService} />

      {snapshot.phase === "idle" && (
        <div className="text-sm text-[color:var(--ink-700)]">
          Waiting for an offer…
        </div>
      )}

      {snapshot.phase === "offer_received" &&
        snapshot.ctx.matchId &&
        snapshot.ctx.participants &&
        typeof snapshot.ctx.score === "number" && (
          <AcceptanceOffer
            offer={{
              matchId: snapshot.ctx.matchId,
              participants: snapshot.ctx.participants,
              score: { total: snapshot.ctx.score },
            }}
            onAccept={() => fsm.acceptOffer()}
            onDecline={() => fsm.declineOffer()}
            busy={busy}
          />
        )}

      {snapshot.phase === "open" && snapshot.ctx.channelId && (
        <div
          role="status"
          className="rounded-xl bg-[color:var(--color-success-100,#dcfce7)] px-3 py-2 text-sm font-medium text-[color:var(--color-success-900,#14532d)]"
        >
          Channel open (id: {snapshot.ctx.channelId})
        </div>
      )}

      {snapshot.phase === "declined" && (
        <div role="status" className="text-sm text-[color:var(--ink-800)]">
          Offer declined.
        </div>
      )}

      {snapshot.phase === "error" && (
        <div
          role="status"
          className="text-sm text-[color:var(--color-danger-700,#b91c1c)]"
        >
          Error: {snapshot.ctx.errorCode}
        </div>
      )}
    </div>
  );
};
