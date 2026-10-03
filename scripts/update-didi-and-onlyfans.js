const sharp = require('sharp');
const fs = require('fs');

async function run() {
  console.log('--- Generating DiDi Food (Big Inverted D, No text) and OnlyFans ---');

  // 1. DIDI FOOD
  // Official DiDi "inverted D" emblem path:
  const didiDPath = "M29.25,11.7v5.01c0,6.17-5.05,11.16-11.24,11.05-6.06-.1-10.87-5.17-10.87-11.24v-3.96c0-.48.39-.87.87-.87h21.24v-6.59H1.7c-.94,0-1.7.76-1.7,1.7v9.29c0,10.03,8.03,18.35,18.06,18.42,10.11.07,18.33-8.1,18.33-18.2v-4.63h-7.14Z";

  // Center and scale D in 512x512:
  // Original bounds: w=36.39, h=26.68.
  // Scale by 9.6 -> width = 349.3, height = 256.1
  // Translate: x = (512 - 349.3) / 2 = 81.35; y = (512 - 256.1) / 2 - (5.11 * 9.6) = 127.95 - 49.05 = 78.9
  const didiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="110" fill="#FF7537" />
  <g transform="translate(81, 79) scale(9.6)">
    <path fill="#FFFFFF" fill-rule="evenodd" d="${didiDPath}" />
  </g>
</svg>`;

  fs.writeFileSync('public/icons/didi-food.svg', didiSvg);
  await sharp(Buffer.from(didiSvg)).png().toFile('public/icons/didi-food.png');
  console.log('✓ public/icons/didi-food.svg & .png generated');

  // 2. ONLYFANS
  const onlyFansPath = "M24 4.003h-4.015c-3.45 0-5.3.197-6.748 1.957a7.996 7.996 0 1 0 2.103 9.211c3.182-.231 5.39-2.134 6.085-5.173 0 0-2.399.585-4.43 0 4.018-.777 6.333-3.037 7.005-5.995zM5.61 11.999A2.391 2.391 0 0 1 9.28 9.97a2.966 2.966 0 0 1 2.998-2.528h.008c-.92 1.778-1.407 3.352-1.998 5.263A2.392 2.392 0 0 1 5.61 12Zm2.386-7.996a7.996 7.996 0 1 0 7.996 7.996 7.996 7.996 0 0 0-7.996-7.996Zm0 10.394A2.399 2.399 0 1 1 10.395 12a2.396 2.396 0 0 1-2.399 2.398Z";

  const onlyFansSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
  <path fill="#00AFF0" fill-rule="evenodd" d="${onlyFansPath}" />
</svg>`;

  fs.writeFileSync('public/icons/onlyfans.svg', onlyFansSvg);
  await sharp(Buffer.from(onlyFansSvg)).resize(512, 512).png().toFile('public/icons/onlyfans.png');
  console.log('✓ public/icons/onlyfans.svg & .png generated');
}

run().catch(console.error);
