// KAMO LIFE - BMC / Value Proposition experience
(function(){
  function mount(){
    if(document.getElementById('valueDesign')) return;
    const anchor=document.getElementById('moveChecklist')||document.getElementById('diagnosis');
    if(!anchor) return;

    const style=document.createElement('style');
    style.textContent=`
      .vp-section{padding:64px max(20px,calc((100vw - 1120px)/2));background:linear-gradient(180deg,#0f2f1b,#174b2b);color:#fff}
      .vp-head{max-width:820px;margin:0 auto 32px;text-align:center}.vp-head .eyebrow{color:#bbf7d0}.vp-head h2{font-size:clamp(1.9rem,4vw,2.7rem);margin:.35rem 0 .8rem}.vp-head p{color:#dcfce7;line-height:1.8}
      .vp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.vp-card{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:20px;padding:22px;backdrop-filter:blur(8px)}
      .vp-card h3{margin:.2rem 0 .7rem;font-size:1.25rem}.vp-card p{color:#e8f5ec;line-height:1.7}.vp-card ul{margin:.8rem 0 0;padding-left:1.2rem;line-height:1.8}.vp-icon{font-size:1.7rem}
      .vp-flow{margin-top:18px;background:#fff;color:#12351e;border-radius:22px;padding:24px}.vp-flow h3{text-align:center;margin-top:0}.vp-steps{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;align-items:stretch}.vp-step{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:14px 10px;text-align:center;font-weight:800;font-size:.88rem}.vp-arrow{display:none}
      .vp-message{margin-top:18px;border-left:4px solid #86efac;background:rgba(255,255,255,.08);padding:18px;border-radius:0 14px 14px 0}.vp-message strong{display:block;font-size:1.2rem;margin-bottom:6px}
      .vp-actions{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:22px}.vp-actions a{display:inline-flex;text-decoration:none;padding:11px 16px;border-radius:999px;font-weight:800}.vp-actions .vp-primary{background:#fff;color:#166534}.vp-actions .vp-secondary{border:1px solid rgba(255,255,255,.5);color:#fff}
      .bmc-mini{margin-top:20px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.bmc-mini div{background:rgba(255,255,255,.08);border-radius:14px;padding:14px}.bmc-mini b{display:block;color:#bbf7d0;margin-bottom:4px}.bmc-mini span{font-size:.86rem;color:#ecfdf5;line-height:1.55}
      @media(max-width:800px){.vp-grid,.bmc-mini{grid-template-columns:1fr}.vp-steps{grid-template-columns:repeat(2,1fr)}.vp-section{padding:48px 16px}}
    `;
    document.head.appendChild(style);

    const section=document.createElement('section');
    section.id='valueDesign';
    section.className='vp-section';
    section.innerHTML=`
      <div class="vp-head">
        <p class="eyebrow">VALUE PROPOSITION × BUSINESS MODEL</p>
        <h2>「情報を見る」から「移住を決める」へ。</h2>
        <p>KAMO LIFEは、移住希望者が抱える不安を減らし、理想の暮らしを具体化して、次の行動まで進めるための移住意思決定支援サービスです。</p>
      </div>
      <div class="vp-grid">
        <article class="vp-card"><div class="vp-icon">😟</div><h3>移住者のPain</h3><p>情報が散らばり、自分に加茂市が合うのか、仕事・住まい・雪・子育てをどう確認すればよいか分かりにくい。</p><ul><li>情報収集に時間がかかる</li><li>移住後の生活を想像しにくい</li><li>相談するほどでもない疑問が多い</li><li>何から始めればよいか分からない</li></ul></article>
        <article class="vp-card"><div class="vp-icon">🛟</div><h3>Pain Reliever</h3><p>診断・AI相談・空き家・求人・イベント・生活費・チェックリストを一つにつなぎ、迷いを減らします。</p><ul><li>8問の相性診断</li><li>24時間AI相談</li><li>住まい・仕事・イベント検索</li><li>準備状況の見える化</li></ul></article>
        <article class="vp-card"><div class="vp-icon">🌱</div><h3>移住者のGain</h3><p>「自分に合う」「ここなら暮らせそう」「次に何をすればよいか分かる」という納得感を得ることが価値です。</p><ul><li>自分らしい暮らしを見つける</li><li>失敗リスクを減らす</li><li>生活を具体的に想像する</li><li>安心して次の一歩へ進む</li></ul></article>
        <article class="vp-card"><div class="vp-icon">✨</div><h3>Gain Creator</h3><p>利用者ごとに、診断結果・次の行動・AI回答・最新情報を組み合わせて、移住検討を前進させます。</p><ul><li>相性％と理由を提示</li><li>個別の次アクション提案</li><li>現地確認につながる導線</li><li>自治体相談への橋渡し</li></ul></article>
      </div>
      <div class="vp-flow">
        <h3>KAMO LIFEがつくる移住導線</h3>
        <div class="vp-steps"><div class="vp-step">① 診断する</div><div class="vp-step">② AIに相談</div><div class="vp-step">③ 住まいを探す</div><div class="vp-step">④ 仕事を探す</div><div class="vp-step">⑤ 現地を知る</div><div class="vp-step">⑥ 移住相談へ</div></div>
      </div>
      <div class="vp-message"><strong>サービスの核</strong>単なる「移住情報サイト」ではなく、加茂市への移住を検討する人の<strong>意思決定と行動を支援するサービス</strong>として設計しています。</div>
      <div class="bmc-mini">
        <div><b>顧客</b><span>移住希望者、U・I・Jターン、子育て世帯、転職・地方暮らし希望者</span></div>
        <div><b>価値</b><span>情報一元化、AI相談、相性診断、次の行動提案、生活の具体化</span></div>
        <div><b>自治体価値</b><span>相談業務効率化、接点増加、関心データ把握、移住施策DX</span></div>
        <div><b>チャネル</b><span>公式サイト、SNS、QR、移住イベント、お試し移住、相談窓口</span></div>
        <div><b>パートナー</b><span>市役所、不動産、ハローワーク、地元企業、地域団体</span></div>
        <div><b>発展性</b><span>他自治体展開、保守運用、AI機能、データ分析、地域連携</span></div>
      </div>
      <div class="vp-actions"><a class="vp-primary" href="#diagnosis">移住診断を始める</a><a class="vp-secondary" href="#aiConsult">AIに相談する</a></div>
    `;
    anchor.after(section);

    const nav=document.getElementById('nav');
    if(nav && !nav.querySelector('a[href="#valueDesign"]')){
      const a=document.createElement('a');a.href='#valueDesign';a.textContent='KAMO LIFEの価値';nav.appendChild(a);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount);
  else setTimeout(mount,0);
})();
