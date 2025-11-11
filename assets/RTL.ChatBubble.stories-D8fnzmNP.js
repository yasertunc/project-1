import{j as r}from"./jsx-runtime-BjG_zV1W.js";import{C as e}from"./ChatBubble-U54yETwu.js";import{u as d}from"./useI18n-3Xq9hJHR.js";import"./useTranslation-9nHNUyAg.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./i18nInstance-CHFDjdcJ.js";const p={title:"Fellowus/ChatBubble (RTL)",component:e,parameters:{layout:"centered"}},t={render:()=>{const{t:a}=d();return r.jsxs("div",{dir:"rtl",style:{width:360,background:"var(--muted-50)",padding:16,borderRadius:12},children:[r.jsx(e,{author:"other",children:a("chat.rtl.greeting")}),r.jsx(e,{author:"me",children:a("chat.rtl.reply")}),r.jsx(e,{author:"system",children:a("chat.rtl.warning")})]})}};var n,o,s;t.parameters={...t.parameters,docs:{...(n=t.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <div dir="rtl" style={{
      width: 360,
      background: "var(--muted-50)",
      padding: 16,
      borderRadius: 12
    }}>
        <ChatBubble author="other">{t("chat.rtl.greeting")}</ChatBubble>
        <ChatBubble author="me">{t("chat.rtl.reply")}</ChatBubble>
        <ChatBubble author="system">{t("chat.rtl.warning")}</ChatBubble>
      </div>;
  }
}`,...(s=(o=t.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};const g=["Arabic"];export{t as Arabic,g as __namedExportsOrder,p as default};
