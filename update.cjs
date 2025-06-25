const fs = require('fs');
const fetch = require('node-fetch'); // ← ここが重要

const DOGET_URL = 'https://script.google.com/macros/s/AKfycbzmuPLd6XMTImW0_y3gK7liC2vJuqhjSq7uih9LWFOlpLXa2p5nZOZHfF0bT2X-GlOicQ/exec';
const TEMPLATE_FILE = 'index.template.html';
const OUTPUT_FILE = 'index.html';

fetch(DOGET_URL)
  .then(res => res.text())
  .then(body => {
    let json;
    try {
      json = JSON.stringify(JSON.parse(body), null, 2);
    } catch (e) {
      console.error('❌ JSONパースに失敗しました:', e.message);
      console.error('▼ レスポンスの冒頭（HTMLと思われる）:\n', body.slice(0, 500));
      process.exit(1);
    }

    const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    const updated = template.replace(
      /<script id="stock-data-json"[^>]*>[^]*?<\/script>/,
      `<script id="stock-data-json" type="application/json">\n${json}\n</script>`
    );
    fs.writeFileSync(OUTPUT_FILE, updated);
    console.log('✅ index.html を更新しました。');
  })
  .catch(err => {
    console.error('❌ fetch エラー:', err);
    process.exit(1);
  });
