import{j as i}from"./jsx-runtime-BjG_zV1W.js";import{r as h}from"./index-BfiH1CDa.js";import"./_commonjsHelpers-Cpj98o6Y.js";function m(t={}){const s=(t.baseUrl??"https://staging-api.fellowus.com").replace(/\/+$/,""),a=t.fetchImpl??fetch;async function e(){var u;const n={"Content-Type":"application/json"},r=await Promise.resolve((u=t.getAuthToken)==null?void 0:u.call(t));return r&&(n.Authorization=`Bearer ${r}`),n}return{async enqueue(n){const r=await a(`${s}/v1/match/enqueue`,{method:"POST",headers:await e(),body:JSON.stringify(n)});if(!r.ok)throw await c(r);return r.json()},async cancel(n){const r=await a(`${s}/v1/match/cancel`,{method:"POST",headers:await e(),body:JSON.stringify(n)});if(!r.ok&&r.status!==204)throw await c(r)},async tick(){const n=await a(`${s}/v1/match/tick`,{method:"POST",headers:await e()});if(!n.ok)throw await c(n);return n.json()}}}async function c(t){let s=`${t.status} ${t.statusText}`;try{const e=await t.json();e!=null&&e.message&&(s=e.message)}catch{}const a=new Error(s);return a.status=t.status,a}const f={title:"Fellowus/API/Matching (mocked)",parameters:{layout:"centered"}},o={render:()=>{const[t,s]=h.useState(null),a=m({baseUrl:"https://mock",fetchImpl:async e=>{const n=String(e);return n.endsWith("/v1/match/enqueue")?new Response(JSON.stringify({request:{requestId:"req_1",userId:"u_1"},enqueuedAt:new Date().toISOString(),priority:1}),{status:202,headers:{"Content-Type":"application/json"}}):n.endsWith("/v1/match/cancel")?new Response(null,{status:204}):n.endsWith("/v1/match/tick")?new Response(JSON.stringify({matchedCount:1,expandedCount:2,queueDepth:10}),{status:200,headers:{"Content-Type":"application/json"}}):new Response(JSON.stringify({code:"NOT_IMPL",message:"Not implemented"}),{status:501,headers:{"Content-Type":"application/json"}})}});return i.jsxs("div",{style:{display:"grid",gap:8,width:420},children:[i.jsx("button",{className:"rounded-pill bg-primary-600 px-3 py-1.5 text-white",onClick:async()=>{const e=await a.enqueue({requestId:"r1",userId:"u1",profileSnapshot:{},geoHash:"sx",coordinates:{lat:0,lon:0},createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+6e4).toISOString(),preferences:{intent:"social",radiusKm:5,locale:"en"},capabilities:{mic:!0,text:!0,shareLocation:!1},reputationScore:.5});s(e)},children:"Call enqueue()"}),i.jsx("button",{className:"rounded-pill bg-muted-100 px-3 py-1.5",onClick:async()=>{await a.cancel({requestId:"r1",userId:"u1"}),s("cancelled")},children:"Call cancel()"}),i.jsx("button",{className:"rounded-pill bg-muted-100 px-3 py-1.5",onClick:async()=>{const e=await a.tick();s(e)},children:"Call tick()"}),i.jsx("pre",{style:{background:"var(--surface)",padding:8,borderRadius:8},children:JSON.stringify(t,null,2)})]})}};var l,d,p;o.parameters={...o.parameters,docs:{...(l=o.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: () => {
    const [out, setOut] = useState<any>(null);
    const client = createMatchingClient({
      baseUrl: "https://mock",
      fetchImpl: async input => {
        const url = String(input);
        if (url.endsWith("/v1/match/enqueue")) {
          return new Response(JSON.stringify({
            request: {
              requestId: "req_1",
              userId: "u_1"
            },
            enqueuedAt: new Date().toISOString(),
            priority: 1
          }), {
            status: 202,
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
        if (url.endsWith("/v1/match/cancel")) {
          return new Response(null, {
            status: 204
          });
        }
        if (url.endsWith("/v1/match/tick")) {
          return new Response(JSON.stringify({
            matchedCount: 1,
            expandedCount: 2,
            queueDepth: 10
          }), {
            status: 200,
            headers: {
              "Content-Type": "application/json"
            }
          });
        }
        return new Response(JSON.stringify({
          code: "NOT_IMPL",
          message: "Not implemented"
        }), {
          status: 501,
          headers: {
            "Content-Type": "application/json"
          }
        });
      }
    });
    return <div style={{
      display: "grid",
      gap: 8,
      width: 420
    }}>
        <button className="rounded-pill bg-primary-600 px-3 py-1.5 text-white" onClick={async () => {
        const res = await client.enqueue({
          requestId: "r1",
          userId: "u1",
          profileSnapshot: {},
          geoHash: "sx",
          coordinates: {
            lat: 0,
            lon: 0
          },
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 60_000).toISOString(),
          preferences: {
            intent: "social",
            radiusKm: 5,
            locale: "en"
          },
          capabilities: {
            mic: true,
            text: true,
            shareLocation: false
          },
          reputationScore: 0.5
        });
        setOut(res);
      }}>
          Call enqueue()
        </button>
        <button className="rounded-pill bg-muted-100 px-3 py-1.5" onClick={async () => {
        await client.cancel({
          requestId: "r1",
          userId: "u1"
        });
        setOut("cancelled");
      }}>
          Call cancel()
        </button>
        <button className="rounded-pill bg-muted-100 px-3 py-1.5" onClick={async () => {
        const res = await client.tick();
        setOut(res);
      }}>
          Call tick()
        </button>
        <pre style={{
        background: "var(--surface)",
        padding: 8,
        borderRadius: 8
      }}>
          {JSON.stringify(out, null, 2)}
        </pre>
      </div>;
  }
}`,...(p=(d=o.parameters)==null?void 0:d.docs)==null?void 0:p.source}}};const S=["Demo"];export{o as Demo,S as __namedExportsOrder,f as default};
