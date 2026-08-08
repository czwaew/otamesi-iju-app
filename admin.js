const $=s=>document.querySelector(s);
const cfg=window.KAMO_CONFIG||{};
$('#apiBase').value=sessionStorage.getItem('kamoApiBase')||cfg.apiBase||'';
$('#adminToken').value=sessionStorage.getItem('kamoAdminToken')||'';

$('#loadStats').addEventListener('click',loadStats);
async function loadStats(){
  const base=$('#apiBase').value.trim().replace(/\/$/,'');
  const token=$('#adminToken').value.trim();
  if(!base||!token){setNotice('API URLと管理トークンを入力してください。',false);return;}
  sessionStorage.setItem('kamoApiBase',base);sessionStorage.setItem('kamoAdminToken',token);
  setNotice('統計データを読み込んでいます…',true);
  try{
    const r=await fetch(base+'/api/stats',{headers:{'x-admin-token':token}});
    const data=await r.json();
    if(!r.ok) throw new Error(data.message||data.error||'読み込みに失敗しました');
    render(data.days||[]);setNotice('統計データを更新しました。',true);
  }catch(e){setNotice('読み込みエラー: '+e.message,false)}
}
function setNotice(t,good){const n=$('#setupNotice');n.textContent=t;n.className='notice'+(good?' good':'')}
function sum(days,key){return days.reduce((a,d)=>a+(d.events?.[key]||0),0)}
function render(days){
  const total=days.reduce((a,d)=>a+(d.total||0),0),pv=sum(days,'page_view'),ai=sum(days,'ai_consult');
  const info=sum(days,'akiyas_view')+sum(days,'jobs_view')+sum(days,'events_view');
  $('#mTotal').textContent=total.toLocaleString();$('#mPV').textContent=pv.toLocaleString();$('#mAI').textContent=ai.toLocaleString();$('#mInfo').textContent=info.toLocaleString();
  $('#dailyRows').innerHTML=days.length?days.map(d=>{const i=(d.events?.akiyas_view||0)+(d.events?.jobs_view||0)+(d.events?.events_view||0);const pct=d.total?Math.round(i/d.total*100):0;return `<tr><td>${esc(d.date)}</td><td>${d.total||0}</td><td>${d.events?.page_view||0}</td><td>${d.events?.ai_consult||0}</td><td>${i}</td><td><div class="bar"><span style="width:${pct}%"></span></div></td></tr>`}).join(''):'<tr><td colspan="6">データがありません。</td></tr>';
  const events={};const paths={};days.forEach(d=>{Object.entries(d.events||{}).forEach(([k,v])=>events[k]=(events[k]||0)+v);Object.entries(d.paths||{}).forEach(([k,v])=>paths[k]=(paths[k]||0)+v)});
  $('#eventBreakdown').innerHTML=bars(events);$('#pathBreakdown').innerHTML=bars(paths);
}
function bars(obj){const rows=Object.entries(obj).sort((a,b)=>b[1]-a[1]);const max=Math.max(1,...rows.map(x=>x[1]));return rows.length?rows.map(([k,v])=>`<div style="display:grid;grid-template-columns:minmax(120px,1fr) 3fr 70px;gap:10px;align-items:center;margin:10px 0"><span>${esc(k)}</span><div class="bar"><span style="width:${v/max*100}%"></span></div><strong>${v}</strong></div>`).join(''):'データがありません。'}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
