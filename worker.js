// KAMO LIFE API - Cloudflare Worker (module syntax)
// Required secret: OPENAI_API_KEY
// Recommended vars: OPENAI_MODEL, ALLOWED_ORIGIN, ADMIN_TOKEN
// Optional KV binding: ANALYTICS

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    try {
      let response;
      if (url.pathname === "/api/health") response = json({ ok: true, service: "KAMO LIFE API", aiConfigured: !!String(env.OPENAI_API_KEY || "").trim(), model: env.OPENAI_MODEL || "gpt-5-mini" });
      else if (url.pathname === "/api/ai" && request.method === "POST") response = await aiConsult(request, env);
      else if (url.pathname === "/api/akiyas") response = await fetchAkiyas();
      else if (url.pathname === "/api/events") response = await fetchEvents(url);
      else if (url.pathname === "/api/jobs") response = await fetchJobs(url);
      else if (url.pathname === "/api/track" && request.method === "POST") response = await track(request, env);
      else if (url.pathname === "/api/stats") response = await stats(request, env);
      else response = json({ error: "not_found" }, 404);
      return withHeaders(response, cors);
    } catch (error) {
      return withHeaders(json({ error: "server_error", message: String(error?.message || error) }, 500), cors);
    }
  }
};

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "*";
  const allowed = env.ALLOWED_ORIGIN || "https://czwaew.github.io";
  const allowOrigin = allowed === "*" || origin === allowed || origin.startsWith("http://localhost") ? origin : allowed;
  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,x-admin-token",
    "vary": "Origin"
  };
}
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS }); }
function withHeaders(response, extra) { const h = new Headers(response.headers); Object.entries(extra).forEach(([k,v])=>h.set(k,v)); return new Response(response.body,{status:response.status,headers:h}); }
function clean(s="") { return s.replace(/<[^>]+>/g," ").replace(/&nbsp;|&#160;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g," ").trim(); }
function abs(base, href="") { try { return new URL(href, base).href; } catch { return base; } }

async function aiConsult(request, env) {
  const apiKey = String(env.OPENAI_API_KEY || "").trim();
  if (!apiKey) return json({ error:"openai_not_configured", message:"OPENAI_API_KEY が設定されていません。" }, 503);
  if (!apiKey.startsWith("sk-")) return json({ error:"openai_key_invalid_format", message:"OPENAI_API_KEY の形式が正しくありません。OpenAI Platformで新しいSecret keyを作成し、Cloudflare Secretへ貼り付けてください。" }, 503);

  const body = await request.json().catch(()=>({}));
  const question = String(body.question || "").trim().slice(0, 3000);
  if (!question) return json({ error:"question_required", message:"相談内容を入力してください。" }, 400);

  const system = `あなたは新潟県加茂市への移住検討者を支援する案内AIです。\n`+
    `回答は日本語で、住まい、仕事、子育て、交通、雪国生活、支援制度、現地確認の観点から具体的に整理してください。\n`+
    `制度・補助金・募集・物件は変更されるため断定せず、必ず加茂市または掲載元の最新公式情報で確認するよう促してください。\n`+
    `医療・法律・税務などの専門判断は専門窓口への確認を促してください。\n`+
    `個人情報の入力を求めないでください。回答は700文字程度まで、見出しと箇条書きで読みやすくしてください。`;

  let r;
  try {
    r = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{"authorization":`Bearer ${apiKey}`,"content-type":"application/json"},
      body:JSON.stringify({
        model: String(env.OPENAI_MODEL || "gpt-5-mini").trim(),
        instructions: system,
        input: question,
        max_output_tokens: 900
      })
    });
  } catch (e) {
    return json({ error:"openai_network_error", message:"OpenAI APIへの接続に失敗しました。", detail:String(e?.message || e) }, 502);
  }

  const raw = await r.text();
  let data = {};
  try { data = JSON.parse(raw); } catch { data = { raw: raw.slice(0, 500) }; }
  if (!r.ok) {
    const detail = data?.error?.message || data?.message || `OpenAI API error (${r.status})`;
    return json({ error:"openai_error", status:r.status, message:detail, detail }, 502);
  }
  const text = data.output_text || (data.output || []).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n");
  return json({ answer:text || "回答を生成できませんでした。", model:String(env.OPENAI_MODEL || "gpt-5-mini").trim() });
}

async function fetchAkiyas() {
  const source = "https://www.homes.co.jp/akiyabank/niigata/kamo/";
  const r = await fetch(source, { headers:{"user-agent":"KAMO-LIFE/1.0 (+https://czwaew.github.io/otamesi-iju-app/)"} });
  if (!r.ok) return json({ items:[], source, error:"source_unavailable" }, 502);
  const html = await r.text();
  const totalMatch = html.match(/加茂市の空き家物件（(\d+)件）/);
  const items = [];
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi;
  let m;
  while ((m = re.exec(html)) && items.length < 30) {
    const title = clean(m[1]);
    const block = m[2];
    if (!/(売買|賃貸)/.test(title)) continue;
    const location = clean((block.match(/所在地[\s\S]*?<[^>]+>([\s\S]*?)<\//i)||[])[1] || (block.match(/新潟県\s*加茂市[^<\n]*/i)||[])[0] || "加茂市");
    const price = clean((block.match(/価格[\s\S]*?<[^>]+>([\s\S]*?)<\//i)||[])[1] || (block.match(/(?:\d+(?:\.\d+)?万円|応相談)/)||[])[0] || "要確認");
    const area = clean((block.match(/土地面積[\s\S]*?([\d,.]+\s*m²)/i)||[])[1] || "");
    const linkMatch = block.match(/href="([^"]+)"[^>]*>\s*詳細をみる/i);
    items.push({ title, location, price, landArea:area, url:linkMatch?abs(source,linkMatch[1]):source });
  }
  return json({ total:Number(totalMatch?.[1]||items.length), items, source, fetchedAt:new Date().toISOString() });
}

async function fetchEvents(url) {
  const now = new Date();
  const y = Number(url.searchParams.get("year")) || now.getUTCFullYear();
  const month = Number(url.searchParams.get("month")) || (now.getUTCMonth()+1);
  const ym = `${y}${String(month).padStart(2,"0")}`;
  const source = `https://www.city.kamo.niigata.jp/event/${ym}/index.html`;
  const r = await fetch(source);
  if (!r.ok) return json({ items:[], source, error:"source_unavailable" }, 502);
  const html = await r.text();
  const items=[];
  const dayBlocks=[...html.matchAll(/(\d{1,2})月(\d{1,2})日[\s\S]*?(?=(?:\d{1,2})月(?:\d{1,2})日|<footer|$)/gi)];
  for(const b of dayBlocks){
    const date=`${y}-${String(b[1]).padStart(2,"0")}-${String(b[2]).padStart(2,"0")}`;
    const links=[...b[0].matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
    for(const lm of links){
      const title=clean(lm[2]);
      if(!title || title.length<3 || /前の月|次の月|リスト形式|表形式|ics/i.test(title)) continue;
      if(items.some(x=>x.date===date&&x.title===title)) continue;
      items.push({date,title,url:abs(source,lm[1])});
      if(items.length>=60) break;
    }
    if(items.length>=60) break;
  }
  return json({ items, source, fetchedAt:new Date().toISOString() });
}

async function fetchJobs(url) {
  const source = "https://www.city.kamo.niigata.jp/ijyu/information/index.html";
  const q = (url.searchParams.get("q")||"").trim().toLowerCase();
  const r = await fetch(source);
  if (!r.ok) return json({ items:[], source, error:"source_unavailable" }, 502);
  const html = await r.text();
  const links=[...html.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)];
  const items=[];
  for(const lm of links){
    const title=clean(lm[2]);
    if(!/(募集|採用|協力隊|職員|就職|仕事|求人)/.test(title)) continue;
    if(q && !title.toLowerCase().includes(q)) continue;
    const before=html.slice(Math.max(0,lm.index-180),lm.index);
    const date=(before.match(/20\d{2}年\d{1,2}月\d{1,2}日/)||[])[0]||"";
    items.push({title,date,url:abs(source,lm[1]),sourceLabel:"加茂市 移住定住サイト"});
    if(items.length>=20) break;
  }
  items.push({title:"ハローワークインターネットサービスで加茂市周辺の求人を検索",date:"",url:"https://www.hellowork.mhlw.go.jp/",sourceLabel:"厚生労働省 ハローワーク"});
  return json({ items, source, fetchedAt:new Date().toISOString() });
}

async function track(request, env) {
  const body = await request.json().catch(()=>({}));
  const event = String(body.event || "page_view").replace(/[^a-zA-Z0-9_:-]/g,"").slice(0,60);
  const path = String(body.path || "/").slice(0,120);
  const day = new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
  if (!env.ANALYTICS) return json({ ok:true, stored:false });
  const key=`stats:${day}`;
  const current=JSON.parse(await env.ANALYTICS.get(key)||'{"total":0,"events":{},"paths":{}}');
  current.total=(current.total||0)+1;
  current.events[event]=(current.events[event]||0)+1;
  current.paths[path]=(current.paths[path]||0)+1;
  await env.ANALYTICS.put(key,JSON.stringify(current),{expirationTtl:60*60*24*400});
  return json({ok:true,stored:true});
}

async function stats(request, env) {
  if (!env.ADMIN_TOKEN || request.headers.get("x-admin-token") !== env.ADMIN_TOKEN) return json({error:"unauthorized"},401);
  if (!env.ANALYTICS) return json({days:[],message:"ANALYTICS KV is not configured"});
  const days=[];
  const now=new Date();
  for(let i=0;i<30;i++){
    const d=new Date(now.getTime()-i*86400000);
    const day=new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Tokyo",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
    const raw=await env.ANALYTICS.get(`stats:${day}`);
    if(raw) days.push({date:day,...JSON.parse(raw)});
  }
  return json({days});
}
