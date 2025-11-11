import{j as e}from"./jsx-runtime-BjG_zV1W.js";const c={title:"Fellowus/Tokens/ContrastGrid"},t=({fg:a,bg:s,label:l})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:6,alignItems:"center",padding:8,background:"var(--surface)",borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.06)"},children:[e.jsx("div",{style:{width:200,height:56,borderRadius:8,background:`var(${s})`,display:"grid",placeItems:"center"},children:e.jsx("span",{style:{color:`var(${a})`,fontWeight:600},children:l})}),e.jsxs("code",{children:[a," on ",s]})]}),r={render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:12},children:[e.jsx(t,{fg:"--ink-200",bg:"--color-primary-600",label:"Button text"}),e.jsx(t,{fg:"--ink-900",bg:"--surface",label:"Body text"}),e.jsx(t,{fg:"--ink-700",bg:"--muted-50",label:"Muted text"})]})};var i,d,n;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12
  }}>
      <Pair fg="--ink-200" bg="--color-primary-600" label="Button text" />
      <Pair fg="--ink-900" bg="--surface" label="Body text" />
      <Pair fg="--ink-700" bg="--muted-50" label="Muted text" />
    </div>
}`,...(n=(d=r.parameters)==null?void 0:d.docs)==null?void 0:n.source}}};const g=["Grid"];export{r as Grid,g as __namedExportsOrder,c as default};
