const sharp = require('sharp');
const fs = require('fs');

const base = 'C:\\Users\\Sergio Ibañez\\.gemini\\antigravity-ide\\brain\\a88f92af-0c44-4878-9636-09ddb03d1b74\\.user_uploaded\\';

async function processAll() {
  if (!fs.existsSync('public/icons')) {
    fs.mkdirSync('public/icons', { recursive: true });
  }

  // 1. Uber Eats: Clean black text on transparent background
  const { data: uberData, info: uberInfo } = await sharp(base + 'media_1791002708142.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const uberOut = Buffer.alloc(uberInfo.width * uberInfo.height * 4);
  for (let i = 0; i < uberData.length; i += 4) {
    const r = uberData[i], g = uberData[i+1], b = uberData[i+2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 95) {
      const alpha = Math.min(255, Math.max(0, Math.round((1 - lum / 95) * 255 * 1.5)));
      uberOut[i] = 0;
      uberOut[i+1] = 0;
      uberOut[i+2] = 0;
      uberOut[i+3] = alpha;
    } else {
      uberOut[i] = 0;
      uberOut[i+1] = 0;
      uberOut[i+2] = 0;
      uberOut[i+3] = 0;
    }
  }
  await sharp(uberOut, { raw: { width: uberInfo.width, height: uberInfo.height, channels: 4 } })
    .trim()
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/icons/uber-eats.png');
  console.log('✓ uber-eats.png generated');

  // Also create a white version of Uber Eats for dark backgrounds
  const uberWhite = Buffer.alloc(uberInfo.width * uberInfo.height * 4);
  for (let i = 0; i < uberData.length; i += 4) {
    const r = uberData[i], g = uberData[i+1], b = uberData[i+2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (lum < 95) {
      const alpha = Math.min(255, Math.max(0, Math.round((1 - lum / 95) * 255 * 1.5)));
      uberWhite[i] = 255;
      uberWhite[i+1] = 255;
      uberWhite[i+2] = 255;
      uberWhite[i+3] = alpha;
    } else {
      uberWhite[i] = 0;
      uberWhite[i+1] = 0;
      uberWhite[i+2] = 0;
      uberWhite[i+3] = 0;
    }
  }
  await sharp(uberWhite, { raw: { width: uberInfo.width, height: uberInfo.height, channels: 4 } })
    .trim()
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/icons/uber-eats-white.png');
  console.log('✓ uber-eats-white.png generated');

  // 2. DiDi Food: Rounded icon with official orange and white logo + text
  const size = 512;
  const radius = 100;
  const didiMask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`
  );
  const didiResized = await sharp(base + 'media_1791002756997.png')
    .resize(size, size, { fit: 'cover' })
    .toBuffer();
  await sharp(didiResized)
    .composite([{ input: didiMask, blend: 'dest-in' }])
    .png()
    .toFile('public/icons/didi-food.png');
  console.log('✓ didi-food.png generated');

  // 3. Rappi: Cursive script + mustache in official coral red on transparent
  const { data: rappiData, info: rappiInfo } = await sharp(base + 'media_1791002811026.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rappiOut = Buffer.alloc(rappiInfo.width * rappiInfo.height * 4);
  for (let i = 0; i < rappiData.length; i += 4) {
    const r = rappiData[i], g = rappiData[i+1], b = rappiData[i+2];
    if (r > 160 && (r - g) > 35 && (r - b) > 35) {
      rappiOut[i] = r;
      rappiOut[i+1] = g;
      rappiOut[i+2] = b;
      rappiOut[i+3] = 255;
    } else {
      rappiOut[i] = 0;
      rappiOut[i+1] = 0;
      rappiOut[i+2] = 0;
      rappiOut[i+3] = 0;
    }
  }
  await sharp(rappiOut, { raw: { width: rappiInfo.width, height: rappiInfo.height, channels: 4 } })
    .trim()
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/icons/rappi.png');
  console.log('✓ rappi.png generated');

  // 4. Mercado Libre: Yellow oval with blue border & handshake on transparent
  const { data: mlData, info: mlInfo } = await sharp(base + 'media_1791002843033.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const mlOut = Buffer.alloc(mlInfo.width * mlInfo.height * 4);
  for (let i = 0; i < mlData.length; i += 4) {
    const r = mlData[i], g = mlData[i+1], b = mlData[i+2];
    if (r < 240 || g < 240 || b < 240) {
      mlOut[i] = r;
      mlOut[i+1] = g;
      mlOut[i+2] = b;
      mlOut[i+3] = 255;
    } else {
      mlOut[i] = 0;
      mlOut[i+1] = 0;
      mlOut[i+2] = 0;
      mlOut[i+3] = 0;
    }
  }
  await sharp(mlOut, { raw: { width: mlInfo.width, height: mlInfo.height, channels: 4 } })
    .trim()
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/icons/mercadolibre.png');
  console.log('✓ mercadolibre.png generated');

  // 5. Amazon: Black letter 'a' with orange smile curve on transparent
  const { data: amzData, info: amzInfo } = await sharp(base + 'media_1791002863855.png')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const amzOut = Buffer.alloc(amzInfo.width * amzInfo.height * 4);
  for (let i = 0; i < amzData.length; i += 4) {
    const r = amzData[i], g = amzData[i+1], b = amzData[i+2];
    if (r < 245 || g < 245 || b < 245) {
      amzOut[i] = r;
      amzOut[i+1] = g;
      amzOut[i+2] = b;
      amzOut[i+3] = 255;
    } else {
      amzOut[i] = 0;
      amzOut[i+1] = 0;
      amzOut[i+2] = 0;
      amzOut[i+3] = 0;
    }
  }
  await sharp(amzOut, { raw: { width: amzInfo.width, height: amzInfo.height, channels: 4 } })
    .trim()
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/icons/amazon.png');
  console.log('✓ amazon.png generated');

  // 6. Shopify: Official Shopping Bag with 'S'
  const shopifySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#95BF47"/>
        <stop offset="100%" stop-color="#5E8E3E"/>
      </linearGradient>
    </defs>
    <path fill="url(#bgGrad)" d="M416 142.4c-.6-5-4.4-8.8-9.4-9.4l-95.6-12.6c-3.4-.4-6.8.8-9.2 3.4l-47.4 51.8c-2.1 2.3-5.1 3.6-8.3 3.6s-6.2-1.3-8.3-3.6l-47.4-51.8c-2.4-2.6-5.8-3.8-9.2-3.4L85.4 133c-5 .6-8.8 4.4-9.4 9.4L42.8 468.9c-.6 5.5 2.3 10.9 7.5 13 1.9.8 3.8 1.3 5.8 1.3 3.8 0 7.3-1.7 9.6-4.5l186.7-222.3c2.3-2.8 5.5-4.3 9.2-4.3s6.8 1.5 9.2 4.3l186.7 222.3c2.3 2.8 5.8 4.5 9.6 4.5 2 0 3.8-.4 5.8-1.3 5.1-2.1 8.1-7.5 7.5-13L416 142.4z"/>
    <path fill="#FFFFFF" opacity="0.95" d="M256 28.5c-3.6 0-6.8 1.5-9.2 4.3l-41 48.9c-4.5 5.3-3.8 13.2 1.5 17.7 5.3 4.5 13.2 3.8 17.7-1.5l31-36.9 31 36.9c4.5 5.3 12.4 6 17.7 1.5 5.3-4.5 6-12.4 1.5-17.7l-41-48.9c-2.4-2.8-5.6-4.3-9.2-4.3z"/>
    <path fill="#FFFFFF" d="M285 272c-5.5-2.2-13.8-4.5-21-4.5-15.5 0-25 7.2-25 18 0 29.5 58 20.5 58 59 0 24-18.5 39.5-46 39.5-15 0-26-3.8-32-6.5l4-20c6.5 3.5 16 6.5 25.5 6.5 16 0 24-8 24-18.5 0-31-57.5-22.5-57.5-59 0-23.5 18-38.5 44-38.5 13 0 23.5 3 28.5 5.5l-4.5 18.5z"/>
  </svg>`;
  await sharp(Buffer.from(shopifySvg))
    .png()
    .toFile('public/icons/shopify.png');
  console.log('✓ shopify.png generated');
}

processAll();
