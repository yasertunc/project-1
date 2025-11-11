import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{B as n}from"./Button-BE7G_roV.js";import{C as a}from"./Chip-B6Hw-TfL.js";import{I as l}from"./Input-CvXwVwrj.js";import{u as p}from"./useTranslation-9nHNUyAg.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./i18nInstance-CHFDjdcJ.js";const j={title:"Fellowus/A11Y/Focus & Keyboard",parameters:{layout:"centered"}},r={render:()=>{const{t}=p("common");return e.jsxs("div",{style:{display:"grid",gap:12,width:360},children:[e.jsx(l,{label:t("alias.label"),placeholder:t("alias.placeholder")}),e.jsx(a,{children:t("chip.music")}),e.jsx(a,{selected:!0,children:t("chip.daily")}),e.jsx(n,{children:t("btn.primary")}),e.jsx(n,{variant:"outline",children:t("btn.outline")})]})},parameters:{test:{disable:!0}}};var s,i,o;r.parameters={...r.parameters,docs:{...(s=r.parameters)==null?void 0:s.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useTranslation("common");
    return <div style={{
      display: "grid",
      gap: 12,
      width: 360
    }}>
        <Input label={t("alias.label")} placeholder={t("alias.placeholder")} />
        <Chip>{t("chip.music")}</Chip>
        <Chip selected>{t("chip.daily")}</Chip>
        <Button>{t("btn.primary")}</Button>
        <Button variant="outline">{t("btn.outline")}</Button>
      </div>;
  },
  parameters: {
    test: {
      disable: true
    }
  }
}`,...(o=(i=r.parameters)==null?void 0:i.docs)==null?void 0:o.source}}};const f=["FocusOrder"];export{r as FocusOrder,f as __namedExportsOrder,j as default};
