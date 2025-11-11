import{j as a}from"./jsx-runtime-BjG_zV1W.js";import{within as w,userEvent as b,expect as x}from"./index-CLEdRh-S.js";import{r as i}from"./index-BfiH1CDa.js";import{A as g}from"./AppShell-Cc01PSbU.js";import{A as B}from"./AcceptanceOffer-ChToTJNx.js";import{C as R}from"./ChannelStatusBanner-Ds-c2FbI.js";import{M as S}from"./ChannelService-BT1_NmFy.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./LanguageSwitcher-DUvom60D.js";async function k(n){return await l(200),{request:{requestId:"req_demo",userId:"u_demo"},enqueuedAt:new Date().toISOString(),priority:1}}async function M(){return await l(300),{matchId:"m_demo",participants:["u_demo","u_peer"],score:{total:.82}}}async function O(){return await l(300),{channelId:"ch_demo"}}function l(n){return new Promise(e=>{setTimeout(e,n)})}const T={title:"Fellowus/Matching/Acceptance Flow",parameters:{layout:"fullscreen"}},o={render:()=>{const n=i.useRef(null);n.current||(n.current=new S);const e=n.current,[t,c]=i.useState("idle"),[s,p]=i.useState(null),[m,r]=i.useState(!1);async function h(){r(!0),await k(),c("queued");const y=await M();p(y),c("offered"),r(!1)}async function v(){if(s){r(!0);try{await e.open({matchId:s.matchId}),await O(),c("accepted")}catch{c("declined")}finally{r(!1)}}}return a.jsx(g,{title:"Acceptance Demo",children:a.jsxs("div",{style:{display:"grid",gap:12,width:460},children:[a.jsx(R,{svc:e}),t==="idle"&&a.jsx("button",{type:"button",className:"rounded-full bg-[color:var(--color-primary-600)] px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[color:var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-primary-400)]",onClick:h,children:"Find match"}),t==="queued"&&a.jsx("div",{role:"status","aria-live":"polite","aria-label":"Searching",children:"Searching…"}),t==="offered"&&s&&a.jsx(B,{offer:s,onAccept:v,onDecline:()=>c("declined"),busy:m}),t==="accepted"&&a.jsx("div",{role:"status","aria-live":"polite","aria-label":"Match accepted, channel open",children:"Match accepted, channel open."}),t==="declined"&&a.jsx("div",{role:"status","aria-live":"polite","aria-label":"Offer declined",children:"Offer declined."})]})})},play:async({canvasElement:n})=>{const e=w(n),t=b.setup();await t.click(e.getByRole("button",{name:/find match/i})),await e.findByRole("status",{name:/searching/i}),await e.findByText(/offer score/i),await t.click(e.getByRole("button",{name:/accept/i})),await e.findByText(/channel open/i),await e.findByRole("status",{name:/match accepted/i}),x(!0).toBe(!0)}};var u,f,d;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const svcRef = React.useRef<MockChannelService | null>(null);
    if (!svcRef.current) {
      svcRef.current = new MockChannelService();
    }
    const svc = svcRef.current;
    const [phase, setPhase] = React.useState<"idle" | "queued" | "offered" | "accepted" | "declined">("idle");
    const [offer, setOffer] = React.useState<Awaited<ReturnType<typeof offerMock>> | null>(null);
    const [busy, setBusy] = React.useState(false);
    async function start() {
      setBusy(true);
      await enqueueMock({});
      setPhase("queued");
      const nextOffer = await offerMock();
      setOffer(nextOffer);
      setPhase("offered");
      setBusy(false);
    }
    async function accept() {
      if (!offer) return;
      setBusy(true);
      try {
        await svc.open({
          matchId: offer.matchId
        });
        await channelOpenMock();
        setPhase("accepted");
      } catch {
        setPhase("declined");
      } finally {
        setBusy(false);
      }
    }
    return <AppShell title="Acceptance Demo">
        <div style={{
        display: "grid",
        gap: 12,
        width: 460
      }}>
          <ChannelStatusBanner svc={svc} />

          {phase === "idle" && <button type="button" className="rounded-full bg-[color:var(--color-primary-600)] px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-[color:var(--color-primary-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-primary-400)]" onClick={start}>
              Find match
            </button>}

          {phase === "queued" && <div role="status" aria-live="polite" aria-label="Searching">
              Searching…
            </div>}

          {phase === "offered" && offer && <AcceptanceOffer offer={offer} onAccept={accept} onDecline={() => setPhase("declined")} busy={busy} />}

          {phase === "accepted" && <div role="status" aria-live="polite" aria-label="Match accepted, channel open">
              Match accepted, channel open.
            </div>}

          {phase === "declined" && <div role="status" aria-live="polite" aria-label="Offer declined">
              Offer declined.
            </div>}
        </div>
      </AppShell>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await user.click(canvas.getByRole("button", {
      name: /find match/i
    }));
    await canvas.findByRole("status", {
      name: /searching/i
    });
    await canvas.findByText(/offer score/i);
    await user.click(canvas.getByRole("button", {
      name: /accept/i
    }));
    await canvas.findByText(/channel open/i);
    await canvas.findByRole("status", {
      name: /match accepted/i
    });
    expect(true).toBe(true);
  }
}`,...(d=(f=o.parameters)==null?void 0:f.docs)==null?void 0:d.source}}};const F=["Demo"];export{o as Demo,F as __namedExportsOrder,T as default};
