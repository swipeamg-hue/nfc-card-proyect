const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const siSvg = await fetchUrl('https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/onlyfans.svg');
  console.log('Simple Icons OnlyFans:\n', siSvg);
  fs.writeFileSync('public/icons/onlyfans-simple.svg', siSvg);
}

run();
