import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

type StatCardProps = {
  label: string;
  value: string;
  help?: string;
  status?: "ok" | "warn" | "bad";
};

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  help,
  status = "ok",
}) => {
  const ring =
    status === "bad"
      ? "ring-semantic-error"
      : status === "warn"
        ? "ring-semantic-warning"
        : "ring-primary-light";
  return (
    <div
      className={`rounded-2xl bg-white p-4 shadow focus-within:${ring}`}
      tabIndex={0}
      aria-label={`${label} ${value}${help ? `. ${help}` : ""}`}
    >
      <div className="text-xs text-text-secondary">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-text-primary">{value}</div>
      {help && <div className="mt-1 text-xs text-text-tertiary">{help}</div>}
    </div>
  );
};

const meta: Meta = {
  title: "Fellowus/Telemetry/Dashboard",
  parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj;

function mockData() {
  return {
    queue: { depth: 18, wait_p95_ms: 28000, expansion_avg: 1.7 },
    match: { success_rate: 0.41, timeout_rate: 0.17, decline_rate: 0.11 },
    channel: { open_latency_p95_ms: 1300, error_rate: 0.002 },
    acceptance: { response_time_p95_ms: 9500, push_failure_rate: 0.003 },
  };
}

export const Overview: Story = {
  render: () => {
    const m = mockData();
    const fmtPct = (x: number) => (x * 100).toFixed(1) + "%";
    const fmtMs = (x: number) => (x / 1000).toFixed(1) + "s";

    return (
      <div
        style={{
          padding: 16,
          background: "var(--color-background-light)",
          minHeight: "100vh",
        }}
      >
        <div className="grid gap-12">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-text-primary">Queue</h2>
            <div className="grid gap-12 md:grid-cols-4">
              <StatCard
                label="Depth"
                value={String(m.queue.depth)}
                help="active requests"
              />
              <StatCard
                label="Wait p95"
                value={fmtMs(m.queue.wait_p95_ms)}
                help="target < 45s"
                status={m.queue.wait_p95_ms < 45000 ? "ok" : "warn"}
              />
              <StatCard
                label="Expansion avg"
                value={String(m.queue.expansion_avg)}
                help="per fulfilled match"
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-text-primary">
              Matching
            </h2>
            <div className="grid gap-12 md:grid-cols-4">
              <StatCard
                label="Success rate"
                value={fmtPct(m.match.success_rate)}
                help=">35% target"
                status={m.match.success_rate > 0.35 ? "ok" : "warn"}
              />
              <StatCard
                label="Timeout rate"
                value={fmtPct(m.match.timeout_rate)}
                help="<20% target"
                status={m.match.timeout_rate < 0.2 ? "ok" : "bad"}
              />
              <StatCard
                label="Decline rate"
                value={fmtPct(m.match.decline_rate)}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-text-primary">
              Acceptance
            </h2>
            <div className="grid gap-12 md:grid-cols-4">
              <StatCard
                label="Response p95"
                value={fmtMs(m.acceptance.response_time_p95_ms)}
              />
              <StatCard
                label="Push failure"
                value={fmtPct(m.acceptance.push_failure_rate)}
                help="<1% target"
                status={m.acceptance.push_failure_rate < 0.01 ? "ok" : "warn"}
              />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-text-primary">Channel</h2>
            <div className="grid gap-12 md:grid-cols-4">
              <StatCard
                label="Open latency p95"
                value={fmtMs(m.channel.open_latency_p95_ms)}
                help="<2s target"
              />
              <StatCard
                label="Error rate"
                value={fmtPct(m.channel.error_rate)}
                help="<0.5% target"
              />
            </div>
          </section>
        </div>
      </div>
    );
  },
};
