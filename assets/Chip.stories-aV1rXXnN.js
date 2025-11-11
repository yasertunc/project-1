import{j as p}from"./jsx-runtime-BjG_zV1W.js";import{C as o}from"./Chip-B6Hw-TfL.js";import{u as d}from"./useTranslation-9nHNUyAg.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./i18nInstance-CHFDjdcJ.js";const j={title:"Fellowus/Chip",component:o,argTypes:{selected:{control:"boolean"}}},e={render:()=>{const{t}=d("common");return p.jsx(o,{children:t("chip.music")})}},r={render:()=>{const{t}=d("common");return p.jsx(o,{selected:!0,children:t("chip.daily")})}};var n,s,c;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useTranslation("common");
    return <Chip>{t("chip.music")}</Chip>;
  }
}`,...(c=(s=e.parameters)==null?void 0:s.docs)==null?void 0:c.source}}};var a,i,m;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useTranslation("common");
    return <Chip selected>{t("chip.daily")}</Chip>;
  }
}`,...(m=(i=r.parameters)==null?void 0:i.docs)==null?void 0:m.source}}};const S=["Default","Selected"];export{e as Default,r as Selected,S as __namedExportsOrder,j as default};
