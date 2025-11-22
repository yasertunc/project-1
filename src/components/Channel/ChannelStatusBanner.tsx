import * as React from "react";

import type {
  ChannelService,
  ChannelState,
} from "../../services/channel/ChannelService";

const toneClasses: Record<ChannelState, string> = {
  idle: "border-[color:var(--ink-700)]/20 bg-[color:var(--muted-100)] text-[color:var(--ink-900)]",
  opening:
    "border-[color:var(--color-accent-amber-400)] bg-[color:var(--color-accent-amber-100)] text-[color:var(--color-accent-amber-900)]",
  open: "border-[color:var(--color-success-400,#22c55e)] bg-[color:var(--color-success-100,#dcfce7)] text-[color:var(--color-success-900,#14532d)]",
  error:
    "border-[color:var(--color-danger-400,#f87171)] bg-[color:var(--color-danger-100,#fee2e2)] text-[color:var(--color-danger-900,#7f1d1d)]",
};

const stateText: Record<ChannelState, string> = {
  idle: "No channel",
  opening: "Opening channel…",
  open: "Channel open",
  error: "Channel error",
};

type ChannelStatusBannerProps = {
  svc: ChannelService;
};

export const ChannelStatusBanner: React.FC<ChannelStatusBannerProps> = ({
  svc,
}) => {
  const [state, setState] = React.useState<ChannelState>(svc.state());

  React.useEffect(() => svc.onState(setState), [svc]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-xl border px-3 py-2 text-sm font-medium ${toneClasses[state]}`}
    >
      {stateText[state]}
    </div>
  );
};
