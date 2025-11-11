import{j as r}from"./jsx-runtime-BjG_zV1W.js";import{r as d}from"./index-BfiH1CDa.js";import{B as c}from"./Button-BE7G_roV.js";import{C as l}from"./Chip-B6Hw-TfL.js";import{M as p}from"./MicButton-DZM--dxx.js";import{M as u}from"./MoodAvatar-CT-FHiGl.js";import{R as m}from"./ReportBubble-t-8pTu_4.js";import{u as f}from"./useI18n-3Xq9hJHR.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./useTranslation-9nHNUyAg.js";import"./i18nInstance-CHFDjdcJ.js";const k={title:"Fellowus/A11Y/Health Check",parameters:{layout:"centered"}},e={render:()=>{const[i,t]=d.useState(!1),{t:o}=f();return r.jsxs("div",{style:{display:"grid",gap:12,width:380,padding:12,background:"var(--muted-50)",borderRadius:12},children:[r.jsx(c,{"aria-label":o("a11y.notifications"),children:"🔔"}),r.jsx(l,{children:o("chip.music")}),r.jsx(p,{recording:i,onPress:()=>t(!0),onRelease:()=>t(!1)}),r.jsx(u,{}),r.jsx("div",{style:{height:120,overflow:"auto",border:"1px solid rgba(0,0,0,0.08)",borderRadius:8,padding:8},children:r.jsx(m,{onClick:()=>{}})})]})}};var n,s,a;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
  render: () => {
    const [rec, setRec] = useState(false);
    const {
      t
    } = useI18n();
    return <div style={{
      display: "grid",
      gap: 12,
      width: 380,
      padding: 12,
      background: "var(--muted-50)",
      borderRadius: 12
    }}>
        <Button aria-label={t("a11y.notifications")}>{"🔔"}</Button>
        <Chip>{t("chip.music")}</Chip>
        <MicButton recording={rec} onPress={() => setRec(true)} onRelease={() => setRec(false)} />
        <MoodAvatar />
        <div style={{
        height: 120,
        overflow: "auto",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 8,
        padding: 8
      }}>
          <ReportBubble onClick={() => {}} />
        </div>
      </div>;
  }
}`,...(a=(s=e.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};const w=["Controls"];export{e as Controls,w as __namedExportsOrder,k as default};
