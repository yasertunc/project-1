import{j as r}from"./jsx-runtime-BjG_zV1W.js";const i={title:"Fellowus/Tokens/Palette"},e=({label:t,color:o})=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:4,alignItems:"center"},children:[r.jsx("div",{style:{width:96,height:48,borderRadius:12,background:`var(${o})`,boxShadow:"inset 0 0 0 1px rgba(0,0,0,0.06)"}}),r.jsx("code",{children:o}),r.jsx("span",{children:t})]}),l={render:()=>r.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(6, 1fr)",gap:12},children:[r.jsx(e,{label:"primary-600",color:"--color-primary-600"}),r.jsx(e,{label:"primary-400",color:"--color-primary-400"}),r.jsx(e,{label:"amber-500",color:"--color-accent-amber-500"}),r.jsx(e,{label:"ink-900",color:"--ink-900"}),r.jsx(e,{label:"muted-50",color:"--muted-50"}),r.jsx(e,{label:"surface",color:"--surface"})]})};var a,s,c;l.parameters={...l.parameters,docs:{...(a=l.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 12
  }}>
      <Box label="primary-600" color="--color-primary-600" />
      <Box label="primary-400" color="--color-primary-400" />
      <Box label="amber-500" color="--color-accent-amber-500" />
      <Box label="ink-900" color="--ink-900" />
      <Box label="muted-50" color="--muted-50" />
      <Box label="surface" color="--surface" />
    </div>
}`,...(c=(s=l.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};const d=["Palette"];export{l as Palette,d as __namedExportsOrder,i as default};
