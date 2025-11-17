import * as React from "react";

import type {
  ChannelService,
  ChannelState,
} from "../../services/channel/ChannelService";

const toneClasses: Record<ChannelState, string> = {
  idle: "border-[color:var(--color-text-secondary)]/20 bg-[color:var(--color-background-light)] text-[color:var(--color-text-primary)]",
  opening:
    "border-[color:var(--color-vip-main)]/30 bg-[color:var(--color-vip-light)]/20 text-[color:var(--color-vip-dark)]",
  open: "border-[color:var(--color-semantic-success)]/30 bg-[color:var(--color-semantic-success)]/10 text-[color:var(--color-semantic-success)]",
  error:
    "border-[color:var(--color-semantic-error)]/30 bg-[color:var(--color-semantic-error)]/10 text-[color:var(--color-semantic-error)]",
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
