import{j as h}from"./jsx-runtime-BjG_zV1W.js";import{C as l}from"./ChatBubble-U54yETwu.js";import{u as b}from"./useTranslation-9nHNUyAg.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./i18nInstance-CHFDjdcJ.js";const B={title:"Fellowus/ChatBubble",component:l},r={args:{author:"other",children:"Hello! 👋"}},e={args:{author:"me",children:"Hi there!"}},o={render:()=>{const{t:p}=b("common");return h.jsx(l,{author:"system",children:p("system.warning")})}};var t,s,n;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    author: "other",
    children: "Hello! 👋"
  }
}`,...(n=(s=r.parameters)==null?void 0:s.docs)==null?void 0:n.source}}};var a,m,c;e.parameters={...e.parameters,docs:{...(a=e.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    author: "me",
    children: "Hi there!"
  }
}`,...(c=(m=e.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};var u,i,d;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useTranslation("common");
    return <ChatBubble author="system">{t("system.warning")}</ChatBubble>;
  }
}`,...(d=(i=o.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};const H=["Inbound","Outbound","System"];export{r as Inbound,e as Outbound,o as System,H as __namedExportsOrder,B as default};
