import{j as o}from"./jsx-runtime-BjG_zV1W.js";import{B as s}from"./Button-BE7G_roV.js";import{u as c}from"./useI18n-3Xq9hJHR.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./useTranslation-9nHNUyAg.js";import"./i18nInstance-CHFDjdcJ.js";const O={title:"Fellowus/Button",component:s,argTypes:{variant:{control:"select",options:["primary","outline","ghost","secondary","accent"]}}},t={render:r=>{const{t:n}=c();return o.jsx(s,{...r,children:n("btn.primary")})},args:{variant:"primary"}},e={render:r=>{const{t:n}=c();return o.jsx(s,{...r,children:n("btn.match")})},args:{variant:"accent"}},a={render:r=>{const{t:n}=c();return o.jsx(s,{...r,children:n("btn.outline")})},args:{variant:"outline"}};var i,u,m;t.parameters={...t.parameters,docs:{...(i=t.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <Button {...args}>{t("btn.primary")}</Button>;
  },
  args: {
    variant: "primary"
  }
}`,...(m=(u=t.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};var p,d,l;e.parameters={...e.parameters,docs:{...(p=e.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <Button {...args}>{t("btn.match")}</Button>;
  },
  args: {
    variant: "accent"
  }
}`,...(l=(d=e.parameters)==null?void 0:d.docs)==null?void 0:l.source}}};var g,y,B;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  render: args => {
    const {
      t
    } = useI18n();
    return <Button {...args}>{t("btn.outline")}</Button>;
  },
  args: {
    variant: "outline"
  }
}`,...(B=(y=a.parameters)==null?void 0:y.docs)==null?void 0:B.source}}};const S=["Primary","Accent","Outline"];export{e as Accent,a as Outline,t as Primary,S as __namedExportsOrder,O as default};
