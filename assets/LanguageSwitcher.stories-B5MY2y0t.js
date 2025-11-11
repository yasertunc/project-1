import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{B as n}from"./Button-BE7G_roV.js";import{C as i}from"./Chip-B6Hw-TfL.js";import{I as o}from"./Input-CvXwVwrj.js";import{L as p}from"./LanguageSwitcher-DUvom60D.js";import{u as d}from"./useI18n-3Xq9hJHR.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./useTranslation-9nHNUyAg.js";import"./i18nInstance-CHFDjdcJ.js";const v={title:"Fellowus/Language Switcher",parameters:{layout:"centered"}},r={render:()=>{const{t}=d();return e.jsxs("div",{style:{display:"grid",gap:12,width:380},children:[e.jsx(p,{}),e.jsx(o,{label:t("alias.label"),placeholder:t("alias.placeholder")}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx(i,{children:t("chip.music")}),e.jsx(i,{selected:!0,children:t("chip.daily")})]}),e.jsx(n,{children:t("btn.primary")}),e.jsx(n,{variant:"outline",children:t("btn.outline")})]})}};var a,s,l;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <div style={{
      display: "grid",
      gap: 12,
      width: 380
    }}>
        <LanguageSwitcher />
        <Input label={t("alias.label")} placeholder={t("alias.placeholder")} />
        <div style={{
        display: "flex",
        gap: 8
      }}>
          <Chip>{t("chip.music")}</Chip>
          <Chip selected>{t("chip.daily")}</Chip>
        </div>
        <Button>{t("btn.primary")}</Button>
        <Button variant="outline">{t("btn.outline")}</Button>
      </div>;
  }
}`,...(l=(s=r.parameters)==null?void 0:s.docs)==null?void 0:l.source}}};const w=["Demo"];export{r as Demo,w as __namedExportsOrder,v as default};
