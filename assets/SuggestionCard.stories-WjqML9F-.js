import{j as t}from"./jsx-runtime-BjG_zV1W.js";import{B as d}from"./Button-BE7G_roV.js";import{u as b}from"./useTranslation-9nHNUyAg.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./i18nInstance-CHFDjdcJ.js";const a=({title:e,meta:o,children:l,primaryCta:i,secondaryCta:s,tone:v="default"})=>{const y={default:"bg-white",info:"bg-[color:var(--muted-50)]",warning:"bg-[color:var(--muted-50)] border border-danger-500/30"}[v];return t.jsxs("div",{className:`rounded-xl p-4 ${y}`,role:"group","aria-label":e,children:[t.jsx("div",{className:"text-ink-900 font-semibold",children:e}),o&&t.jsx("div",{className:"text-xs text-ink-500 mt-0.5",children:o}),l&&t.jsx("div",{className:"mt-2 text-sm text-ink-700",children:l}),t.jsxs("div",{className:"mt-3 flex gap-2",children:[i&&t.jsx(d,{onClick:i.onClick,children:i.label}),s&&t.jsx(d,{variant:"outline",onClick:s.onClick,children:s.label})]})]})};a.__docgenInfo={description:"",methods:[],displayName:"SuggestionCard",props:{title:{required:!0,tsType:{name:"string"},description:""},meta:{required:!1,tsType:{name:"string"},description:""},children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:""},primaryCta:{required:!1,tsType:{name:"signature",type:"object",raw:"{ label: string; onClick?: () => void }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}}]}},description:""},secondaryCta:{required:!1,tsType:{name:"signature",type:"object",raw:"{ label: string; onClick?: () => void }",signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!1}}]}},description:""},tone:{required:!1,tsType:{name:"union",raw:'"default" | "info" | "warning"',elements:[{name:"literal",value:'"default"'},{name:"literal",value:'"info"'},{name:"literal",value:'"warning"'}]},description:"",defaultValue:{value:'"default"',computed:!1}}}};const q={title:"Fellowus/SuggestionCard",component:a},n={render:()=>{const{t:e}=b("common");return t.jsx(a,{title:e("guide.waiting.title"),meta:e("guide.waiting.meta"),primaryCta:{label:e("btn.join")},secondaryCta:{label:e("guide.hide")}})}},r={render:()=>{const{t:e}=b("common");return t.jsx(a,{title:e("system.warning"),tone:"warning",secondaryCta:{label:e("guide.rules")}})}};var u,m,c;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useTranslation("common");
    return <SuggestionCard title={t("guide.waiting.title")} meta={t("guide.waiting.meta")} primaryCta={{
      label: t("btn.join")
    }} secondaryCta={{
      label: t("guide.hide")
    }} />;
  }
}`,...(c=(m=n.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var g,p,f;r.parameters={...r.parameters,docs:{...(g=r.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useTranslation("common");
    return <SuggestionCard title={t("system.warning")} tone="warning" secondaryCta={{
      label: t("guide.rules")
    }} />;
  }
}`,...(f=(p=r.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};const T=["Guide","Warning"];export{n as Guide,r as Warning,T as __namedExportsOrder,q as default};
