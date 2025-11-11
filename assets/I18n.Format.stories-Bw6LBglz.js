import{j as t}from"./jsx-runtime-BjG_zV1W.js";import o from"./setup-D9H8pr0h.js";import{u as l}from"./useI18n-3Xq9hJHR.js";import"./i18nInstance-CHFDjdcJ.js";import"./useTranslation-9nHNUyAg.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";function c(n,e){const r=o.language||"en";return new Intl.NumberFormat(r,e).format(n)}function u(n,e){const r=o.language||"en",m=n instanceof Date?n:new Date(n);return new Intl.DateTimeFormat(r,{dateStyle:"medium",...e}).format(m)}function f(n){const e=o.language||"en";return new Intl.RelativeTimeFormat(e,{numeric:"auto",style:"short"}).format(n,"minute")}const j={title:"Fellowus/I18n/Formatting",parameters:{layout:"centered"}},a={render:()=>{const{t:n}=l(),e=new Date;return t.jsxs("div",{style:{display:"grid",gap:8,width:380,background:"var(--muted-50)",padding:12,borderRadius:12},children:[t.jsxs("div",{children:[t.jsxs("b",{children:[n("alias.label"),":"]})," ",n("alias.placeholder")]}),t.jsxs("div",{children:[t.jsxs("b",{children:[n("format.number"),":"]})," ",c(123456789e-2)]}),t.jsxs("div",{children:[t.jsxs("b",{children:[n("format.date"),":"]})," ",u(e)]}),t.jsxs("div",{children:[t.jsxs("b",{children:[n("format.eta"),":"]})," ",f(5)]})]})}};var i,s,d;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    const now = new Date();
    return <div style={{
      display: "grid",
      gap: 8,
      width: 380,
      background: "var(--muted-50)",
      padding: 12,
      borderRadius: 12
    }}>
        <div>
          <b>{t("alias.label")}:</b> {t("alias.placeholder")}
        </div>
        <div>
          <b>{t("format.number")}:</b> {formatNumber(1234567.89)}
        </div>
        <div>
          <b>{t("format.date")}:</b> {formatDate(now)}
        </div>
        <div>
          <b>{t("format.eta")}:</b> {formatRelativeMinutes(5)}
        </div>
      </div>;
  }
}`,...(d=(s=a.parameters)==null?void 0:s.docs)==null?void 0:d.source}}};const D=["Demo"];export{a as Demo,D as __namedExportsOrder,j as default};
