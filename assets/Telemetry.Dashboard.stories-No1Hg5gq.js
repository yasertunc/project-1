import{j as e}from"./jsx-runtime-BjG_zV1W.js";const a=({label:t,value:s,help:n,status:l="ok"})=>{const d=l==="bad"?"ring-danger-500":l==="warn"?"ring-[var(--color-accent-amber-500)]":"ring-primary-400";return e.jsxs("div",{className:`rounded-2xl bg-white p-4 shadow focus-within:${d}`,tabIndex:0,"aria-label":`${t} ${s}${n?`. ${n}`:""}`,children:[e.jsx("div",{className:"text-xs text-ink-700",children:t}),e.jsx("div",{className:"mt-1 text-2xl font-semibold text-ink-900",children:s}),n&&e.jsx("div",{className:"mt-1 text-xs text-ink-500",children:n})]})},p={title:"Fellowus/Telemetry/Dashboard",parameters:{layout:"fullscreen"}};function o(){return{queue:{depth:18,wait_p95_ms:28e3,expansion_avg:1.7},match:{success_rate:.41,timeout_rate:.17,decline_rate:.11},channel:{open_latency_p95_ms:1300,error_rate:.002},acceptance:{response_time_p95_ms:9500,push_failure_rate:.003}}}const r={render:()=>{const t=o(),s=l=>(l*100).toFixed(1)+"%",n=l=>(l/1e3).toFixed(1)+"s";return e.jsx("div",{style:{padding:16,background:"var(--muted-50)",minHeight:"100vh"},children:e.jsxs("div",{className:"grid gap-12",children:[e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-semibold text-ink-900",children:"Queue"}),e.jsxs("div",{className:"grid gap-12 md:grid-cols-4",children:[e.jsx(a,{label:"Depth",value:String(t.queue.depth),help:"active requests"}),e.jsx(a,{label:"Wait p95",value:n(t.queue.wait_p95_ms),help:"target < 45s",status:"ok"}),e.jsx(a,{label:"Expansion avg",value:String(t.queue.expansion_avg),help:"per fulfilled match"})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-semibold text-ink-900",children:"Matching"}),e.jsxs("div",{className:"grid gap-12 md:grid-cols-4",children:[e.jsx(a,{label:"Success rate",value:s(t.match.success_rate),help:">35% target",status:"ok"}),e.jsx(a,{label:"Timeout rate",value:s(t.match.timeout_rate),help:"<20% target",status:"ok"}),e.jsx(a,{label:"Decline rate",value:s(t.match.decline_rate)})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-semibold text-ink-900",children:"Acceptance"}),e.jsxs("div",{className:"grid gap-12 md:grid-cols-4",children:[e.jsx(a,{label:"Response p95",value:n(t.acceptance.response_time_p95_ms)}),e.jsx(a,{label:"Push failure",value:s(t.acceptance.push_failure_rate),help:"<1% target",status:"ok"})]})]}),e.jsxs("section",{children:[e.jsx("h2",{className:"mb-3 text-xl font-semibold text-ink-900",children:"Channel"}),e.jsxs("div",{className:"grid gap-12 md:grid-cols-4",children:[e.jsx(a,{label:"Open latency p95",value:n(t.channel.open_latency_p95_ms),help:"<2s target"}),e.jsx(a,{label:"Error rate",value:s(t.channel.error_rate),help:"<0.5% target"})]})]})]})})}};var c,i,m;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => {
    const m = mockData();
    const fmtPct = (x: number) => (x * 100).toFixed(1) + "%";
    const fmtMs = (x: number) => (x / 1000).toFixed(1) + "s";
    return <div style={{
      padding: 16,
      background: "var(--muted-50)",
      minHeight: "100vh"
    }}>
        <div className="grid gap-12">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink-900">Queue</h2>
            <div className="grid gap-12 md:grid-cols-4">
              <StatCard label="Depth" value={String(m.queue.depth)} help="active requests" />
              <StatCard label="Wait p95" value={fmtMs(m.queue.wait_p95_ms)} help="target < 45s" status={m.queue.wait_p95_ms < 45000 ? "ok" : "warn"} />
              <StatCard label="Expansion avg" value={String(m.queue.expansion_avg)} help="per fulfilled match" />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink-900">
              Matching
            </h2>
            <div className="grid gap-12 md:grid-cols-4">
              <StatCard label="Success rate" value={fmtPct(m.match.success_rate)} help=">35% target" status={m.match.success_rate > 0.35 ? "ok" : "warn"} />
              <StatCard label="Timeout rate" value={fmtPct(m.match.timeout_rate)} help="<20% target" status={m.match.timeout_rate < 0.2 ? "ok" : "bad"} />
              <StatCard label="Decline rate" value={fmtPct(m.match.decline_rate)} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink-900">
              Acceptance
            </h2>
            <div className="grid gap-12 md:grid-cols-4">
              <StatCard label="Response p95" value={fmtMs(m.acceptance.response_time_p95_ms)} />
              <StatCard label="Push failure" value={fmtPct(m.acceptance.push_failure_rate)} help="<1% target" status={m.acceptance.push_failure_rate < 0.01 ? "ok" : "warn"} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-ink-900">Channel</h2>
            <div className="grid gap-12 md:grid-cols-4">
              <StatCard label="Open latency p95" value={fmtMs(m.channel.open_latency_p95_ms)} help="<2s target" />
              <StatCard label="Error rate" value={fmtPct(m.channel.error_rate)} help="<0.5% target" />
            </div>
          </section>
        </div>
      </div>;
  }
}`,...(m=(i=r.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const h=["Overview"];export{r as Overview,h as __namedExportsOrder,p as default};
