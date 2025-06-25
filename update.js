const fs = require('fs');
const https = require('https');

const DOGET_URL = 'https://script.google.com/macros/s/AKfycbzmuPLd6XMTImW0_y3gK7liC2vJuqhjSq7uih9LWFOlpLXa2p5nZOZHfF0bT2X-GlOicQ/exec';
const TEMPLATE_FILE = 'index.template.html';
const OUTPUT_FILE = 'index.html';

https.get(DOGET_URL, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      // ✅ JSONとして解析（失敗する場合あり）
      const json = JSON.stringify(JSON.parse(body), null, 2);

      const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
      const updated = template.replace(
        /<script id="stock-data-json"[^>]*>[^]*?<\/script>/,
        `<script id="stock-data-json" type="application/json">\n${json}\n</script>`
      );
      fs.writeFileSync(OUTPUT_FILE, updated);
      console.log('✅ index.html を更新しました。');

    } catch (e) {
      console.error('❌ JSONパースに失敗しました:', e.message);
      console.error('▼ レスポンス内容の冒頭（HTMLと思われる）:');
      console.error(body.substring(0, 500)); // HTMLの冒頭500文字を出力
      process.exit(1); // エラー終了
    }
  });
}).on('error', err => {
  console.error('❌ HTTP取得エラー:', err);
});
