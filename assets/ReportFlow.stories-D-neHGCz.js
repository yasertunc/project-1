import{j as t}from"./jsx-runtime-BjG_zV1W.js";import{r as c}from"./index-BfiH1CDa.js";import{R as v}from"./ReportBubble-t-8pTu_4.js";import{u as y}from"./useI18n-3Xq9hJHR.js";import{within as g,userEvent as b}from"./index-CLEdRh-S.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./useTranslation-9nHNUyAg.js";import"./i18nInstance-CHFDjdcJ.js";const w=["harassment","hate","self-harm","spam","personal-info","other"],f=({open:o,onClose:e,onSelect:a})=>{const{t:n}=y(),s=c.useRef(null);if(c.useEffect(()=>{if(!o)return;const r=i=>{i.key==="Escape"&&e()};document.addEventListener("keydown",r);const d=setTimeout(()=>{var i;return(i=s.current)==null?void 0:i.focus()},0);return()=>{document.removeEventListener("keydown",r),clearTimeout(d)}},[o,e]),!o)return null;const h=r=>{switch(r){case"harassment":return n("report.category.harassment");case"hate":return n("report.category.hate");case"self-harm":return n("report.category.self_harm");case"spam":return n("report.category.spam");case"personal-info":return n("report.category.personal_info");default:return n("report.category.other")}};return t.jsxs("div",{role:"dialog","aria-modal":"true","aria-labelledby":"report-title",className:"fixed inset-0 z-50 grid place-items-center",children:[t.jsx("div",{className:"absolute inset-0 bg-black/30",onClick:e,"aria-hidden":!0}),t.jsxs("div",{className:"relative w-[360px] rounded-2xl bg-white p-4 shadow",children:[t.jsx("div",{id:"report-title",className:"mb-2 text-base font-semibold text-ink-900",children:n("report.modal.title")}),t.jsx("div",{className:"grid gap-2",children:w.map((r,d)=>t.jsx("button",{ref:d===0?s:void 0,className:"w-full rounded-xl border border-ink-700/10 bg-muted-50 px-3 py-2 text-left hover:bg-muted-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",onClick:()=>a(r),children:t.jsx("div",{className:"font-medium text-ink-900",children:h(r)})},r))}),t.jsx("div",{className:"mt-3 flex justify-end",children:t.jsx("button",{className:"rounded-pill bg-muted-100 px-3 py-1.5 text-ink-700 hover:bg-muted-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",onClick:e,children:n("common.cancel")})})]})]})};f.__docgenInfo={description:"",methods:[],displayName:"ReportCategoryModal",props:{open:{required:!0,tsType:{name:"boolean"},description:""},onClose:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},onSelect:{required:!0,tsType:{name:"signature",type:"function",raw:"(category: ReportCategory) => void",signature:{arguments:[{type:{name:"union",raw:`| "harassment"
| "hate"
| "self-harm"
| "spam"
| "personal-info"
| "other"`,elements:[{name:"literal",value:'"harassment"'},{name:"literal",value:'"hate"'},{name:"literal",value:'"self-harm"'},{name:"literal",value:'"spam"'},{name:"literal",value:'"personal-info"'},{name:"literal",value:'"other"'}]},name:"category"}],return:{name:"void"}}},description:""}}};const N={title:"Fellowus/Report Flow",parameters:{layout:"centered"}},l={render:()=>{const[o,e]=c.useState(!1),[a,n]=c.useState(null);return t.jsxs("div",{style:{width:380,height:260,overflow:"auto",border:"1px solid #eee",padding:8,borderRadius:8},children:[t.jsxs("div",{style:{height:320,position:"relative"},children:[t.jsx(v,{onClick:()=>e(!0)}),a&&t.jsxs("div",{"aria-live":"polite",style:{marginTop:8},children:["Selected: ",a]})]}),t.jsx(f,{open:o,onClose:()=>e(!1),onSelect:s=>{n(s),e(!1)}})]})},play:async({canvasElement:o})=>{const e=g(o),a=b.setup();await a.click(e.getByRole("button",{name:/report/i}));const n=await e.findByRole("button",{name:/harassment|taciz|مضايقة/i});if(document.activeElement!==n)throw new Error("Focus not on first option when modal opens");await a.keyboard("{Escape}"),await a.click(e.getByRole("button",{name:/report/i})),await a.click(await e.findByRole("button",{name:/spam|dolandırıcılık|مزعجة/i})),await e.findByText(/selected:\s*(spam|personal-info|harassment|hate|self-harm|other)/i)}};var u,m,p;l.parameters={...l.parameters,docs:{...(u=l.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = useState(false);
    const [picked, setPicked] = useState<ReportCategory | null>(null);
    return <div style={{
      width: 380,
      height: 260,
      overflow: "auto",
      border: "1px solid #eee",
      padding: 8,
      borderRadius: 8
    }}>
        <div style={{
        height: 320,
        position: "relative"
      }}>
          <ReportBubble onClick={() => setOpen(true)} />
          {picked && <div aria-live="polite" style={{
          marginTop: 8
        }}>
              Selected: {picked}
            </div>}
        </div>
        <ReportCategoryModal open={open} onClose={() => setOpen(false)} onSelect={category => {
        setPicked(category);
        setOpen(false);
      }} />
      </div>;
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await user.click(canvas.getByRole("button", {
      name: /report/i
    }));
    const first = await canvas.findByRole("button", {
      name: /harassment|taciz|مضايقة/i
    });
    if (document.activeElement !== first) {
      throw new Error("Focus not on first option when modal opens");
    }
    await user.keyboard("{Escape}");
    await user.click(canvas.getByRole("button", {
      name: /report/i
    }));
    await user.click(await canvas.findByRole("button", {
      name: /spam|dolandırıcılık|مزعجة/i
    }));
    await canvas.findByText(/selected:\\s*(spam|personal-info|harassment|hate|self-harm|other)/i);
  }
}`,...(p=(m=l.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};const S=["BubbleToModal"];export{l as BubbleToModal,S as __namedExportsOrder,N as default};
