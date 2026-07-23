const $=(s,p=document)=>p.querySelector(s); const $$=(s,p=document)=>[...p.querySelectorAll(s)];
$('#menuBtn').addEventListener('click',()=>$('#nav').classList.toggle('open'));
$$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav').classList.remove('open')));
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.jump)?.scrollIntoView({behavior:'smooth'})));

$$('.tab').forEach(btn=>btn.addEventListener('click',()=>{ $$('.tab').forEach(x=>x.classList.remove('active')); $$('.tab-panel').forEach(x=>x.classList.remove('active')); btn.classList.add('active'); $('#'+btn.dataset.tab).classList.add('active'); }));

$('#diagnosisForm').addEventListener('submit',e=>{e.preventDefault(); const d=Object.fromEntries(new FormData(e.target)); let title='まちなか便利暮らしタイプ'; let body='JR加茂駅や商店街に近い生活圏を中心に、まずは賃貸で地域との相性を確かめるプランがおすすめです。'; let actions=['駅周辺の賃貸を探す','平日・休日の買い物動線を確認','移住相談窓口へ相談']; if(d.home==='buy'||d.people==='family'){title='家族でじっくり定住タイプ';body='住宅取得支援や子育て情報を確認しながら、学校・医療・通勤を含む生活圏を比較するプランがおすすめです。';actions=['住宅取得補助金を確認','空き家・中古住宅を比較','子育て窓口へ相談'];} if(d.home==='old'||d.work==='startup'||d.priority==='community'){title='地域参加・チャレンジタイプ';body='空き家活用や創業、地域活動との相性が良いタイプです。改修費用や仕事づくりを含めて現地相談から始めましょう。';actions=['空き家バンクを確認','創業支援を調べる','移住体験で人に会う'];} const r=$('#diagnosisResult'); r.innerHTML=`<p class="eyebrow">診断結果</p><h3>${title}</h3><p>${body}</p><ol>${actions.map(x=>`<li>${x}</li>`).join('')}</ol><a class="btn primary" href="#consult">この内容で相談する</a>`;r.classList.remove('hidden');r.scrollIntoView({behavior:'smooth',block:'center'});});

const calc=()=>{const ids=['rent','food','utility','transport','other'];const total=ids.reduce((s,id)=>s+(Number($('#'+id).value)||0),0);$('#monthlyTotal').textContent=total.toLocaleString()+'円';$('#annualTotal').textContent='年間 '+(total*12).toLocaleString()+'円';};$$('.calculator-card input').forEach(i=>i.addEventListener('input',calc));

const modal=$('#modal'); $('[data-modal="housingGrant"]').addEventListener('click',()=>modal.classList.remove('hidden'));$('#closeModal').addEventListener('click',()=>modal.classList.add('hidden'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
$('#grantCheck').addEventListener('submit',e=>{e.preventDefault();const checked=$$('input[type=checkbox]',e.target).filter(x=>x.checked).length;$('#grantResult').textContent=checked===5?'基本条件には該当する可能性があります。住宅要件・申請時期を公式窓口で確認してください。':`${checked}/5項目にチェック。未該当項目があるため、対象外の可能性があります。例外・詳細は公式窓口へご相談ください。`;});

const form=$('#consultForm'); const saved=localStorage.getItem('kamoConsultMemo'); if(saved){try{const d=JSON.parse(saved);Object.entries(d).forEach(([k,v])=>{if(form.elements[k])form.elements[k].value=v})}catch{}}
$('#saveMemo').addEventListener('click',()=>{const d=Object.fromEntries(new FormData(form));localStorage.setItem('kamoConsultMemo',JSON.stringify(d));alert('相談メモをこの端末に保存しました。');});
form.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(form));const subject=encodeURIComponent('加茂市への移住相談（KAMO LIFEから作成）');const body=encodeURIComponent(`お名前：${d.name||'未入力'}\n現在のお住まい：${d.area||'未入力'}\n移住希望時期：${d.timing}\n相談分野：${d.topic}\n\n相談内容：\n${d.message||'未入力'}\n\n※加茂市移住相談アプリ（非公式試作版）から作成`);location.href=`mailto:kikaku@city.kamo.niigata.jp?subject=${subject}&body=${body}`;});

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
