// KAMO LIFE runtime configuration
// Cloudflare Worker production endpoint
window.KAMO_CONFIG = {
  apiBase: "https://otamesi-iju-app.nbmgvcy27n.workers.dev",
  officialAkiyaUrl: "https://www.homes.co.jp/akiyabank/niigata/kamo/",
  officialEventUrl: "https://www.city.kamo.niigata.jp/event/",
  officialMigrationUrl: "https://www.city.kamo.niigata.jp/ijyu/"
};

// Top visual: Aomi Shrine torii background, followed by Niagara fireworks video.
(function upgradeHero(){
  const home = document.getElementById('home');
  if (!home) return;
  home.style.cssText = 'background:#0b1f16;color:#fff;padding:0 0 42px;overflow:hidden;';
  home.innerHTML = `
    <div style="position:relative;min-height:min(82vh,760px);display:flex;align-items:flex-end;background-image:url('https://jl-db.nfaj.go.jp/assets/images/202203/x/4fb5a61737f4f2d68f7a617929790267.jpg');background-size:cover;background-position:center center;">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.12) 15%,rgba(5,25,16,.82) 100%);"></div>
      <div style="position:relative;z-index:1;width:min(1120px,90%);margin:0 auto;padding:70px 0 58px;">
        <p class="eyebrow">KAMO CITY / AUTUMN SCENERY</p>
        <h1 style="font-size:clamp(38px,6.4vw,74px);line-height:1.08;margin:10px 0 18px;text-shadow:0 3px 18px rgba(0,0,0,.45);">加茂で見つける、<br>あなたらしい暮らし。</h1>
        <p style="font-size:clamp(16px,2vw,20px);max-width:720px;color:#f2f8f4;text-shadow:0 2px 10px rgba(0,0,0,.45);">自然、歴史、暮らしが近いまち。住まい・仕事・子育て・支援制度まで、加茂市への移住をひとつの画面でサポートします。</p>
        <div class="hero-actions"><a class="btn primary" href="#diagnosis">3分で移住診断</a><a class="btn ghost" href="#consult">相談してみる</a></div>
        <div class="hero-badges"><span>⛩ 加茂の秋景色</span><span>🏞 加茂山・加茂川</span><span>🚃 JR加茂駅</span></div>
      </div>
    </div>
    <div style="width:min(1120px,92%);margin:34px auto 0;">
      <div style="margin-bottom:15px;text-align:center;">
        <p class="eyebrow">KAMO NIAGARA FIREWORKS</p>
        <h2 style="font-size:clamp(26px,4vw,42px);margin:6px 0 10px;">加茂のナイアガラ花火</h2>
        <p style="color:#dcebe1;margin:0 0 18px;">加茂の魅力を動画でご覧ください。</p>
      </div>
      <div style="position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:20px;overflow:hidden;box-shadow:0 18px 55px rgba(0,0,0,.36);">
        <iframe
          src="https://www.youtube.com/embed/4geHlbPh2Ps?rel=0&modestbranding=1&playsinline=1"
          title="加茂市 ナイアガラ花火"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
          style="position:absolute;inset:0;width:100%;height:100%;border:0;">
        </iframe>
      </div>
    </div>`;
})();

// BMC / Value Proposition experience
(function loadStrategy(){
  if (document.querySelector('script[data-kamo-strategy]')) return;
  const s = document.createElement('script');
  s.src = 'strategy.js?v=1';
  s.defer = true;
  s.dataset.kamoStrategy = '1';
  document.head.appendChild(s);
})();
