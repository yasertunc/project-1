import{j as n}from"./jsx-runtime-BjG_zV1W.js";import{within as g,userEvent as y}from"./index-CLEdRh-S.js";import{A as d}from"./AppShell-Cc01PSbU.js";import{B as s}from"./Button-BE7G_roV.js";import{C as a}from"./Chip-B6Hw-TfL.js";import{u as v}from"./useI18n-3Xq9hJHR.js";import"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./LanguageSwitcher-DUvom60D.js";import"./useTranslation-9nHNUyAg.js";import"./i18nInstance-CHFDjdcJ.js";const R={title:"Fellowus/App Shell",component:d,parameters:{layout:"fullscreen"}},e={render:()=>{const{t}=v();return n.jsx(d,{title:"Fellowus",children:n.jsxs("div",{style:{display:"grid",gap:16},children:[n.jsx("p",{children:t("system.warning")}),n.jsxs("div",{style:{display:"flex",gap:8},children:[n.jsx(a,{children:t("chip.music")}),n.jsx(a,{selected:!0,children:t("chip.daily")})]}),n.jsxs("div",{style:{display:"flex",gap:8},children:[n.jsx(s,{variant:"primary",children:t("btn.join")}),n.jsx(s,{variant:"outline",children:t("btn.skip")})]})]})})},play:async({canvasElement:t})=>{const o=g(t),r=y.setup();await r.keyboard("{Tab}{Enter}");const m=o.getByRole("main");if(document.activeElement!==m)throw new Error("Skip link did not move focus to <main>");const i=o.getByRole("button",{name:/toggle theme/i}),u=i.textContent;await r.click(i);const h=i.textContent;if(u===h)throw new Error("Theme label did not update")}};var l,p,c;e.parameters={...e.parameters,docs:{...(l=e.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const {
      t
    } = useI18n();
    return <AppShell title="Fellowus">
        <div style={{
        display: "grid",
        gap: 16
      }}>
          <p>{t("system.warning")}</p>
          <div style={{
          display: "flex",
          gap: 8
        }}>
            <Chip>{t("chip.music")}</Chip>
            <Chip selected>{t("chip.daily")}</Chip>
          </div>
          <div style={{
          display: "flex",
          gap: 8
        }}>
            <Button variant="primary">{t("btn.join")}</Button>
            <Button variant="outline">{t("btn.skip")}</Button>
          </div>
        </div>
      </AppShell>;
  },
  play: async ({
    canvasElement
  }) => {
    const c = within(canvasElement);
    const user = userEvent.setup();
    await user.keyboard("{Tab}{Enter}");
    const main = c.getByRole("main");
    if (document.activeElement !== main) {
      throw new Error("Skip link did not move focus to <main>");
    }
    const toggle = c.getByRole("button", {
      name: /toggle theme/i
    });
    const prev = toggle.textContent;
    await user.click(toggle);
    const next = toggle.textContent;
    if (prev === next) {
      throw new Error("Theme label did not update");
    }
  }
}`,...(c=(p=e.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};const T=["Landing"];export{e as Landing,T as __namedExportsOrder,R as default};
