import{j as m}from"./jsx-runtime-BjG_zV1W.js";import{I as o}from"./Input-CvXwVwrj.js";import{u as i}from"./useTranslation-9nHNUyAg.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./i18nInstance-CHFDjdcJ.js";const x={title:"Fellowus/Input",component:o},e={render:()=>{const{t:r}=i("common");return m.jsx(o,{label:r("alias.label"),placeholder:r("alias.placeholder"),leftIcon:"🎤"})}},a={render:()=>{const{t:r}=i("common");return m.jsx(o,{label:r("alias.label"),placeholder:r("alias.placeholder"),error:r("error.required")})}};var t,l,n;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useTranslation("common");
    return <Input label={t("alias.label")} placeholder={t("alias.placeholder")} leftIcon="🎤" />;
  }
}`,...(n=(l=e.parameters)==null?void 0:l.docs)==null?void 0:n.source}}};var s,c,p;a.parameters={...a.parameters,docs:{...(s=a.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useTranslation("common");
    return <Input label={t("alias.label")} placeholder={t("alias.placeholder")} error={t("error.required")} />;
  }
}`,...(p=(c=a.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};const j=["Default","Error"];export{e as Default,a as Error,j as __namedExportsOrder,x as default};
