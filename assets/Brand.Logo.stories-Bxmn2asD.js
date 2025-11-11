import{j as e}from"./jsx-runtime-BjG_zV1W.js";const l={blue:"/brand/fellowus-logo-blue.png",amber:"/brand/fellowus-logo-amber.png"},a=({size:t=64,variant:v="blue",shadow:z=!0,className:x="","aria-label":w,"data-testid":y,...h})=>{const j=l[v]??l.blue,n=w??"Fellowus logo",L=y??"brand-logo";return e.jsx("img",{src:j,width:t,height:t,alt:n,"aria-label":n,"data-testid":L,className:`${z?"drop-shadow-[0_4px_8px_rgba(0,0,0,0.18)]":""} ${x}`.trim(),...h})};a.__docgenInfo={description:"",methods:[],displayName:"Logo",props:{size:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"64",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:'"blue" | "amber"',elements:[{name:"literal",value:'"blue"'},{name:"literal",value:'"amber"'}]},description:"",defaultValue:{value:'"blue"',computed:!1}},shadow:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},"data-testid":{required:!1,tsType:{name:"string"},description:""},className:{defaultValue:{value:'""',computed:!1},required:!1}}};const T={title:"Fellowus/Brand/Logo",component:a,parameters:{layout:"centered"},argTypes:{size:{control:{type:"number",min:16,max:256,step:8}},variant:{control:{type:"radio"},options:["blue","amber"]},shadow:{control:"boolean"}}},s={args:{size:96,variant:"blue",shadow:!0}},r={args:{size:96,variant:"amber",shadow:!1}},o={render:()=>e.jsxs("div",{style:{display:"flex",gap:16,alignItems:"center",background:"var(--muted-50)",padding:16,borderRadius:12},children:[e.jsx(a,{size:32}),e.jsx(a,{size:48}),e.jsx(a,{size:64}),e.jsx(a,{size:96}),e.jsx(a,{size:128})]})};var i,d,u;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    size: 96,
    variant: "blue",
    shadow: true
  }
}`,...(u=(d=s.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};var m,c,p;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    size: 96,
    variant: "amber",
    shadow: false
  }
}`,...(p=(c=r.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};var g,b,f;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 16,
    alignItems: "center",
    background: "var(--muted-50)",
    padding: 16,
    borderRadius: 12
  }}>
      <Logo size={32} />
      <Logo size={48} />
      <Logo size={64} />
      <Logo size={96} />
      <Logo size={128} />
    </div>
}`,...(f=(b=o.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};const S=["Default","Amber","Sizes"];export{r as Amber,s as Default,o as Sizes,S as __namedExportsOrder,T as default};
