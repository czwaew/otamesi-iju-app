// KAMO LIFE runtime configuration
// Cloudflare Worker production endpoint
window.KAMO_CONFIG = {
  apiBase: "https://otamesi-iju-app.nbmgvcy27n.workers.dev",
  officialAkiyaUrl: "https://www.homes.co.jp/akiyabank/niigata/kamo/",
  officialEventUrl: "https://www.city.kamo.niigata.jp/event/",
  officialMigrationUrl: "https://www.city.kamo.niigata.jp/ijyu/"
};

// BMC / Value Proposition experience
(function loadStrategy(){
  if (document.querySelector('script[data-kamo-strategy]')) return;
  const s = document.createElement('script');
  s.src = 'strategy.js?v=1';
  s.defer = true;
  s.dataset.kamoStrategy = '1';
  document.head.appendChild(s);
})();
