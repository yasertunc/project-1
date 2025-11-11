import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{within as d,userEvent as h}from"./index-CLEdRh-S.js";import{r as y}from"./index-BfiH1CDa.js";import{A as f}from"./AppShell-Cc01PSbU.js";import{C as x}from"./ChannelStatusBanner-Ds-c2FbI.js";import{B as i}from"./Button-BE7G_roV.js";import{M as w}from"./ChannelService-BT1_NmFy.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./LanguageSwitcher-DUvom60D.js";const D={title:"Fellowus/Channel/Status",parameters:{layout:"fullscreen"}},B=()=>{const t=y.useRef(null);t.current||(t.current=new w);const n=t.current;return e.jsx(f,{title:"Channel Demo",children:e.jsxs("div",{style:{display:"grid",gap:12,width:420},children:[e.jsx(x,{svc:n}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx(i,{onClick:()=>n.open({matchId:"m_123"}),children:"Open"}),e.jsx(i,{variant:"outline",onClick:()=>n.close(),children:"Close"})]})]})})},v=()=>{const t=y.useRef(null);t.current||(t.current=new w);const n=t.current;return e.jsx(f,{title:"Channel Error",children:e.jsxs("div",{style:{display:"grid",gap:12,width:420},children:[e.jsx(x,{svc:n}),e.jsx(i,{onClick:()=>n.open({matchId:"fail_1"}),children:"Open (fail)"})]})})},a={render:()=>e.jsx(B,{}),play:async({canvasElement:t})=>{const n=d(t),s=h.setup();await n.findByText(/no channel/i),await s.click(n.getByRole("button",{name:/open/i})),await n.findByText(/opening channel/i),await n.findByText(/channel open/i),await s.click(n.getByRole("button",{name:/close/i})),await n.findByText(/no channel/i)}},r={render:()=>e.jsx(v,{}),play:async({canvasElement:t})=>{const n=d(t);await h.setup().click(n.getByRole("button",{name:/open \(fail\)/i})),await n.findByText(/channel error/i)}};var c,o,l;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: () => <ChannelHappyDemo />,
  play: async ({
    canvasElement
  }) => {
    const c = within(canvasElement);
    const user = userEvent.setup();
    await c.findByText(/no channel/i);
    await user.click(c.getByRole("button", {
      name: /open/i
    }));
    await c.findByText(/opening channel/i);
    await c.findByText(/channel open/i);
    await user.click(c.getByRole("button", {
      name: /close/i
    }));
    await c.findByText(/no channel/i);
  }
}`,...(l=(o=a.parameters)==null?void 0:o.docs)==null?void 0:l.source}}};var p,u,m;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: () => <ChannelErrorDemo />,
  play: async ({
    canvasElement
  }) => {
    const c = within(canvasElement);
    const user = userEvent.setup();
    await user.click(c.getByRole("button", {
      name: /open \\(fail\\)/i
    }));
    await c.findByText(/channel error/i);
  }
}`,...(m=(u=r.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};const H=["HappyPath","ErrorPath"];export{r as ErrorPath,a as HappyPath,H as __namedExportsOrder,D as default};
