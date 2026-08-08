const $=(s,p=document)=>p.querySelector(s);
const $$=(s,p=document)=>[...p.querySelectorAll(s)];

$('#menuBtn')?.addEventListener('click',()=>$('#nav')?.classList.toggle('open'));
$$('#nav a').forEach(a=>a.addEventListener('click',()=>$('#nav')?.classList.remove('open')));
const bindJumps=()=>$$('[data-jump]').forEach(b=>{
  if(b.dataset.jumpBound) return;
  b.dataset.jumpBound='1';
  b.addEventListener('click',()=>$(b.dataset.jump)?.scrollIntoView({behavior:'smooth'}));
});
bindJumps();

$$('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.tab').forEach(x=>x.classList.remove('active'));
  $$('.tab-panel').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  $('#'+btn.dataset.tab)?.classList.add('active');
}));

// --- 追加UI: 診断強化 / 移住準備チェック / AI相談 / 情報ハブ ---
const enhancedStyle=document.createElement('style');
enhancedStyle.textContent=`
  .enhanced-section{padding:64px max(20px,calc((100vw - 1120px)/2));}
  .enhanced-soft{background:#f5faf6;}
  .enhanced-head{max-width:760px;margin:0 auto 28px;text-align:center}
  .enhanced-head h2{margin:.25rem 0 .6rem;font-size:clamp(1.7rem,4vw,2.35rem)}
  .feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
  .feature-card,.ai-card,.check-card{background:#fff;border:1px solid #dce9df;border-radius:18px;padding:20px;box-shadow:0 10px 30px rgba(22,101,52,.07)}
  .feature-card h3,.ai-card h3,.check-card h3{margin:.2rem 0 .65rem}
  .feature-icon{font-size:2rem}
  .official-link{display:inline-flex;margin-top:10px;font-weight:700;color:#166534}
  .fresh-note{font-size:.82rem;color:#64748b;margin-top:10px}
  .ai-layout{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px;align-items:start}
  .ai-options{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
  .ai-chip{border:1px solid #b9d7c0;background:#f2faf4;border-radius:999px;padding:8px 12px;cursor:pointer}
  .ai-card textarea{width:100%;min-height:110px;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:12px;padding:12px;font:inherit}
  .ai-answer{white-space:pre-wrap;background:#f7faf8;border-radius:14px;padding:16px;min-height:150px;line-height:1.75}
  .score-meter{height:12px;background:#e5e7eb;border-radius:999px;overflow:hidden;margin:12px 0}
  .score-meter>span{display:block;height:100%;background:#16803d;border-radius:999px}
  .score-row{display:flex;justify-content:space-between;gap:16px;font-size:.94rem}
  .result-reasons{display:grid;gap:8px;margin:14px 0}
  .reason-pill{background:#eef8f1;border-radius:10px;padding:9px 11px}
  .check-list{display:grid;gap:10px;margin:16px 0}
  .check-item{display:flex;gap:10px;align-items:flex-start;background:#f8fbf9;padding:12px;border-radius:12px}
  .check-progress{font-weight:800;color:#166534}
  .section-anchor-nav{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:14px}
  .section-anchor-nav a{border:1px solid #cae1d0;background:#fff;padding:8px 12px;border-radius:999px;text-decoration:none;color:#14532d;font-size:.9rem}
  @media(max-width:760px){.feature-grid,.ai-layout{grid-template-columns:1fr}.enhanced-section{padding:46px 16px}}
`;
document.head.appendChild(enhancedStyle);

const diagnosisForm=$('#diagnosisForm');
if(diagnosisForm){
  const submitBtn=$('button[type="submit"]',diagnosisForm);
  const extra=document.createElement('div');
  extra.innerHTML=`
    <fieldset><legend>6. 車の利用について</legend>
      <label><input type="radio" name="car" value="yes" required> 日常的に使える</label>
      <label><input type="radio" name="car" value="sometimes"> 必要に応じて使える</label>
      <label><input type="radio" name="car" value="no"> できれば車に頼らず暮らしたい</label>
    </fieldset>
    <fieldset><legend>7. 雪国での暮らし</legend>
      <label><input type="radio" name="snow" value="ok" required> 雪かき・冬の運転も含めて前向き</label>
      <label><input type="radio" name="snow" value="learn"> 不安はあるが準備して慣れたい</label>
      <label><input type="radio" name="snow" value="concern"> 冬の生活負担はできるだけ避けたい</label>
    </fieldset>
    <fieldset><legend>8. 地域との関わり方</legend>
      <label><input type="radio" name="relation" value="active" required> 地域活動や交流に積極的に参加したい</label>
      <label><input type="radio" name="relation" value="natural"> 無理のない範囲で交流したい</label>
      <label><input type="radio" name="relation" value="private"> プライベートを重視したい</label>
    </fieldset>
  `;
  submitBtn?.before(...extra.children);
  const desc=$('#diagnosis .section-head p:last-child');
  if(desc) desc.textContent='8つの質問を点数化し、加茂暮らしとの相性と確認ポイントを提案します。';
}

const support=$('#support');
if(support){
  const hub=document.createElement('section');
  hub.id='infoHub';
  hub.className='enhanced-section';
  hub.innerHTML=`
    <div class="enhanced-head">
      <p class="eyebrow">LOCAL INFORMATION</p>
      <h2>住まい・仕事・イベント情報</h2>
      <p>移住検討で確認したい情報をまとめました。掲載内容は変わるため、最新情報は必ず公式ページでご確認ください。</p>
      <div class="section-anchor-nav"><a href="#housingInfo">空き家</a><a href="#jobInfo">求人</a><a href="#eventInfo">イベント</a></div>
    </div>
    <div class="feature-grid">
      <article id="housingInfo" class="feature-card">
        <div class="feature-icon">🏠</div><h3>空き家・住まい</h3>
        <p>加茂市は全国版空き家バンクを活用した空き家バンクを運用しています。中古住宅・土地探しの入口として確認できます。</p>
        <a class="official-link" target="_blank" rel="noopener" href="https://www.city.kamo.niigata.jp/docs/30251.html">加茂市 空き家バンク →</a>
        <p class="fresh-note">物件の募集状況・価格・利用条件はリンク先で確認してください。</p>
      </article>
      <article id="jobInfo" class="feature-card">
        <div class="feature-icon">💼</div><h3>求人・働き方</h3>
        <p>市内・近隣就職、地域おこし協力隊、創業、リモートワークなど、希望する働き方から情報を探せます。</p>
        <a class="official-link" target="_blank" rel="noopener" href="https://www.city.kamo.niigata.jp/ijyu/">加茂市 移住定住サイト →</a><br>
        <a class="official-link" target="_blank" rel="noopener" href="https://www.city.kamo.niigata.jp/shisei/jinji/saiyou/">加茂市 職員採用情報 →</a>
        <p class="fresh-note">民間求人はハローワーク等も併用すると比較しやすくなります。</p>
      </article>
      <article id="eventInfo" class="feature-card">
        <div class="feature-icon">🎪</div><h3>イベント・地域を知る</h3>
        <p>イベント参加は、移住前に地域の雰囲気・人との距離感・生活圏を知る機会になります。</p>
        <a class="official-link" target="_blank" rel="noopener" href="https://www.city.kamo.niigata.jp/event/">加茂市 イベント情報 →</a>
        <p class="fresh-note">開催日・申込・中止変更などは公式情報をご確認ください。</p>
      </article>
    </div>
  `;
  support.before(hub);
}

const diagnosis=$('#diagnosis');
if(diagnosis){
  const checklist=document.createElement('section');
  checklist.id='moveChecklist';
  checklist.className='enhanced-section enhanced-soft';
  checklist.innerHTML=`
    <div class="enhanced-head"><p class="eyebrow">PREPARATION CHECK</p><h2>移住準備チェックリスト</h2><p>「何から始めればいい？」を8項目で簡単に確認できます。</p></div>
    <div class="check-card">
      <div class="check-progress" id="checkProgress">0 / 8 完了</div>
      <div class="score-meter"><span id="checkMeter" style="width:0%"></span></div>
      <div class="check-list" id="checkList">
        <label class="check-item"><input type="checkbox"> 家族・同居予定者と移住目的を共有した</label>
        <label class="check-item"><input type="checkbox"> 希望エリアと通勤・通学動線を確認した</label>
        <label class="check-item"><input type="checkbox"> 賃貸・購入・空き家活用の優先順位を決めた</label>
        <label class="check-item"><input type="checkbox"> 仕事・収入の見通しを確認した</label>
        <label class="check-item"><input type="checkbox"> 子育て・医療・買い物環境を確認した</label>
        <label class="check-item"><input type="checkbox"> 車・公共交通など日常の移動手段を考えた</label>
        <label class="check-item"><input type="checkbox"> 冬の雪・光熱費・除雪を含めて生活費を考えた</label>
        <label class="check-item"><input type="checkbox"> 現地訪問または移住相談を行う予定を立てた</label>
      </div>
      <p id="checkAdvice">まずは気になる項目から確認してみましょう。</p>
    </div>
  `;
  diagnosis.after(checklist);
}

const life=$('#life');
if(life){
  const ai=document.createElement('section');
  ai.id='aiConsult';
  ai.className='enhanced-section enhanced-soft';
  ai.innerHTML=`
    <div class="enhanced-head"><p class="eyebrow">AI MOVE SUPPORT</p><h2>AI移住相談</h2><p>相談内容から、確認すべき情報と次の行動を整理します。</p></div>
    <div class="ai-layout">
      <div class="ai-card">
        <h3>相談したいことを入力</h3>
        <div class="ai-options">
          <button type="button" class="ai-chip" data-aiq="空き家を探したい">🏠 空き家</button>
          <button type="button" class="ai-chip" data-aiq="仕事や求人を探したい">💼 仕事</button>
          <button type="button" class="ai-chip" data-aiq="子育て環境を知りたい">👶 子育て</button>
          <button type="button" class="ai-chip" data-aiq="支援制度を知りたい">💴 支援制度</button>
          <button type="button" class="ai-chip" data-aiq="移住前にイベントや地域を知りたい">🎪 地域・イベント</button>
        </div>
        <textarea id="aiQuestion" placeholder="例：家族3人で移住を検討しています。空き家と仕事を中心に何を確認すればいいですか？"></textarea>
        <button id="aiAsk" type="button" class="btn primary full">相談内容を整理する</button>
        <p class="fresh-note">現在はブラウザ内の案内ロジックで回答します。個人情報・機密情報は入力しないでください。</p>
      </div>
      <div class="ai-card">
        <h3>相談アドバイス</h3>
        <div id="aiAnswer" class="ai-answer">相談内容を入力すると、住まい・仕事・子育て・支援制度・現地確認の観点から次の行動を提案します。</div>
      </div>
    </div>
  `;
  life.after(ai);
}

const nav=$('#nav');
if(nav){
  const a=document.createElement('a'); a.href='#aiConsult'; a.textContent='AI相談'; nav.appendChild(a);
  const b=document.createElement('a'); b.href='#infoHub'; b.textContent='空き家・求人'; nav.appendChild(b);
}

bindJumps();

// --- 強化版 相性診断ロジック ---
diagnosisForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const d=Object.fromEntries(new FormData(e.target));
  const scores={convenience:0,family:0,challenge:0,nature:0};
  const reasons=[];

  if(d.people==='family'){scores.family+=3;reasons.push('家族での生活基盤を重視');}
  if(d.people==='couple'){scores.family+=1;scores.convenience+=1;}
  if(d.people==='single'){scores.convenience+=2;scores.challenge+=1;}

  if(d.home==='rent'){scores.convenience+=3;reasons.push('まず賃貸で暮らしを試したい');}
  if(d.home==='buy'){scores.family+=3;reasons.push('住宅購入・定住志向が高い');}
  if(d.home==='old'){scores.challenge+=4;scores.nature+=1;reasons.push('空き家・古民家活用に関心');}

  if(d.work==='local'){scores.convenience+=2;scores.family+=1;}
  if(d.work==='remote'){scores.nature+=2;scores.convenience+=1;reasons.push('リモートワークを想定');}
  if(d.work==='startup'){scores.challenge+=4;reasons.push('起業・地域活動に関心');}

  if(d.priority==='nature'){scores.nature+=4;reasons.push('自然・落ち着きを重視');}
  if(d.priority==='access'){scores.convenience+=4;reasons.push('交通・買い物の便利さを重視');}
  if(d.priority==='community'){scores.challenge+=3;scores.family+=1;reasons.push('地域とのつながりを重視');}

  if(d.car==='yes'){scores.nature+=2;scores.family+=1;}
  if(d.car==='sometimes'){scores.convenience+=1;scores.nature+=1;}
  if(d.car==='no'){scores.convenience+=3;reasons.push('車に頼りすぎない生活を希望');}

  if(d.snow==='ok'){scores.nature+=2;scores.challenge+=1;}
  if(d.snow==='learn'){scores.family+=1;scores.convenience+=1;reasons.push('冬の暮らしは事前確認が必要');}
  if(d.snow==='concern'){scores.convenience+=2;reasons.push('雪・冬季負担への不安あり');}

  if(d.relation==='active'){scores.challenge+=3;}
  if(d.relation==='natural'){scores.family+=1;scores.nature+=1;}
  if(d.relation==='private'){scores.convenience+=2;}

  const type=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
  const maxPossible=24;
  const total=Math.min(100,Math.round((Object.values(scores).sort((a,b)=>b-a)[0]/maxPossible)*100+45));
  const profiles={
    convenience:{title:'まちなか・便利暮らしタイプ',body:'JR加茂駅や中心市街地に近い生活圏から検討し、買い物・通勤・冬の移動を実際に確認するのがおすすめです。',actions:['駅周辺の賃貸・住宅を比較','平日と休日の交通・買い物動線を確認','冬季の移動方法を確認','移住相談窓口で希望条件を共有']},
    family:{title:'家族でじっくり定住タイプ',body:'住まいだけでなく、通勤・通学、医療、子育て、支援制度をセットで比較すると具体的な移住判断がしやすくなります。',actions:['住宅取得・空き家情報を確認','学校・保育・医療の生活圏を確認','利用できる支援制度を公式情報で確認','家族で現地を歩いてみる']},
    challenge:{title:'地域参加・チャレンジタイプ',body:'空き家活用、創業、地域活動などと相性の良い傾向です。物件・仕事・地域との接点を同時に探すと移住後のイメージが具体化します。',actions:['空き家バンクを確認','創業・仕事・地域おこし情報を確認','地域イベントへ参加','現地の相談窓口で人や活動を紹介してもらう']},
    nature:{title:'自然とゆとり暮らしタイプ',body:'自然環境を楽しみながら、自分に合う住環境を選ぶタイプです。車、雪、通信、通勤など日常条件を現地で確かめることが重要です。',actions:['自然環境と生活利便性の両方を現地確認','車・冬季交通・除雪を確認','通信環境と仕事環境を確認','生活費シミュレーターで予算を確認']}
  };
  const p=profiles[type];
  const timingAdvice=d.timing==='3か月以内'?'移住時期が近いため、住まい・仕事・行政手続きを優先して具体化しましょう。':d.timing==='半年以内'?'半年以内なら、現地訪問と住まい・仕事探しを並行すると進めやすい時期です。':'まずは情報収集と現地体験から始め、希望条件を絞り込むのがおすすめです。';
  const r=$('#diagnosisResult');
  if(r){
    r.innerHTML=`<p class="eyebrow">診断結果</p><h3>${p.title}</h3>
      <div class="score-row"><strong>加茂暮らし相性の目安</strong><strong>${total}%</strong></div>
      <div class="score-meter"><span style="width:${total}%"></span></div>
      <p>${p.body}</p><p><b>移住時期：</b>${timingAdvice}</p>
      <div class="result-reasons">${reasons.slice(0,4).map(x=>`<div class="reason-pill">✓ ${x}</div>`).join('')}</div>
      <h4>次に確認したいこと</h4><ol>${p.actions.map(x=>`<li>${x}</li>`).join('')}</ol>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn primary" href="#aiConsult">AI相談で深掘り</a><a class="btn ghost" href="#infoHub">空き家・求人を見る</a></div>
      <p class="fresh-note">※この診断は移住検討の整理を目的とした参考情報で、移住の適否を保証するものではありません。</p>`;
    r.classList.remove('hidden');
    r.scrollIntoView({behavior:'smooth',block:'center'});
  }
});

// --- チェックリスト ---
const checkList=$('#checkList');
const updateChecklist=()=>{
  if(!checkList) return;
  const checks=$$('input[type="checkbox"]',checkList);
  const done=checks.filter(x=>x.checked).length;
  $('#checkProgress').textContent=`${done} / ${checks.length} 完了`;
  $('#checkMeter').style.width=`${done/checks.length*100}%`;
  $('#checkAdvice').textContent=done===8?'準備項目が一通り確認できています。次は加茂市の公式窓口や現地訪問で具体的な条件を確認しましょう。':done>=5?'かなり整理できています。未確認項目を埋めると、移住相談がより具体的になります。':done>=2?'準備が進み始めています。住まい・仕事・移動手段を優先すると判断しやすくなります。':'まずは気になる項目から確認してみましょう。';
  localStorage.setItem('kamoMoveChecklist',JSON.stringify(checks.map(x=>x.checked)));
};
if(checkList){
  const savedChecks=JSON.parse(localStorage.getItem('kamoMoveChecklist')||'[]');
  $$('input[type="checkbox"]',checkList).forEach((x,i)=>{x.checked=!!savedChecks[i];x.addEventListener('change',updateChecklist)});
  updateChecklist();
}

// --- AI風相談（ブラウザ内ロジック） ---
$$('.ai-chip').forEach(btn=>btn.addEventListener('click',()=>{
  const q=$('#aiQuestion'); if(q){q.value=btn.dataset.aiq;q.focus();}
}));
$('#aiAsk')?.addEventListener('click',()=>{
  const q=($('#aiQuestion')?.value||'').trim();
  const out=$('#aiAnswer'); if(!out) return;
  if(!q){out.textContent='相談内容を入力してください。例：「家族で移住したい。空き家と仕事を知りたい」';return;}
  const topics=[];
  if(/空き家|住宅|家|賃貸|購入|住まい/.test(q)) topics.push('🏠 住まい：空き家バンク、賃貸、住宅取得支援を比較し、通勤・買い物・除雪も含めて現地確認しましょう。');
  if(/仕事|求人|就職|転職|起業|働/.test(q)) topics.push('💼 仕事：市内・近隣就職、地域おこし協力隊、創業、リモートなど複数ルートで探すと選択肢が広がります。');
  if(/子育て|子ども|学校|保育|家族/.test(q)) topics.push('👶 子育て：学校・保育、医療、遊び場、送迎動線、利用できる支援制度を生活圏ごとに確認しましょう。');
  if(/支援|補助|助成|お金|費用/.test(q)) topics.push('💴 支援制度：年度・年齢・世帯・転入時期などで条件が変わるため、申請前に必ず加茂市の最新公式情報を確認しましょう。');
  if(/イベント|地域|交流|体験|知りたい/.test(q)) topics.push('🎪 地域を知る：イベントや移住体験は、地域の雰囲気や人との距離感を知る良い機会です。');
  if(/車|交通|電車|通勤|移動/.test(q)) topics.push('🚃 移動：JR加茂駅の利用に加え、日常の買い物や冬季移動まで含めて車の必要性を確認しましょう。');
  if(/雪|冬|寒/.test(q)) topics.push('❄️ 冬の暮らし：除雪、冬用タイヤ、暖房費、通勤時間などを移住前に確認すると安心です。');
  if(topics.length===0) topics.push('🌿 まず「住まい・仕事・家族・移動・予算・移住時期」の6点に分けて希望を書き出すと、相談内容を整理しやすくなります。');
  out.textContent=`ご相談：「${q}」\n\n${topics.join('\n\n')}\n\n次の一歩：\n1. 下の住まい・仕事・イベント情報から公式ページを確認\n2. 移住準備チェックリストで未確認項目を整理\n3. 具体的な制度・募集状況は加茂市の公式窓口へ確認\n\n※現在は生成AI APIではなく、ブラウザ内の案内ロジックによる試作機能です。`;
});

const calc=()=>{
  const ids=['rent','food','utility','transport','other'];
  const total=ids.reduce((s,id)=>s+(Number($('#'+id)?.value)||0),0);
  if($('#monthlyTotal')) $('#monthlyTotal').textContent=total.toLocaleString()+'円';
  if($('#annualTotal')) $('#annualTotal').textContent='年間 '+(total*12).toLocaleString()+'円';
};
$$('.calculator-card input').forEach(i=>i.addEventListener('input',calc));

const modal=$('#modal');
$('[data-modal="housingGrant"]')?.addEventListener('click',()=>modal?.classList.remove('hidden'));
$('#closeModal')?.addEventListener('click',()=>modal?.classList.add('hidden'));
modal?.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
$('#grantCheck')?.addEventListener('submit',e=>{
  e.preventDefault();
  const checked=$$('input[type=checkbox]',e.target).filter(x=>x.checked).length;
  const total=$$('input[type=checkbox]',e.target).length;
  const result=$('#grantResult');
  if(result) result.textContent=checked===total
    ?'入力した基本項目には該当する可能性があります。ただし制度条件は年度ごとに変わるため、必ず最新の公式要綱・窓口で確認してください。'
    :`${checked}/${total}項目にチェック。未該当項目があります。例外や最新条件を公式窓口でご確認ください。`;
});

const form=$('#consultForm');
if(form){
  const saved=localStorage.getItem('kamoConsultMemo');
  if(saved){try{const d=JSON.parse(saved);Object.entries(d).forEach(([k,v])=>{if(form.elements[k])form.elements[k].value=v})}catch{}}
  $('#saveMemo')?.addEventListener('click',()=>{
    const d=Object.fromEntries(new FormData(form));
    localStorage.setItem('kamoConsultMemo',JSON.stringify(d));
    alert('相談メモをこの端末に保存しました。');
  });
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form));
    const subject=encodeURIComponent('加茂市への移住相談（KAMO LIFEから作成）');
    const body=encodeURIComponent(`お名前：${d.name||'未入力'}\n現在のお住まい：${d.area||'未入力'}\n移住希望時期：${d.timing||'未入力'}\n相談分野：${d.topic||'未入力'}\n\n相談内容：\n${d.message||'未入力'}\n\n※加茂市移住相談アプリ（非公式試作版）から作成`);
    location.href=`mailto:kikaku@city.kamo.niigata.jp?subject=${subject}&body=${body}`;
  });
}

if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
