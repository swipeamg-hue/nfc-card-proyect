const potrace = require('potrace');
const sharp = require('sharp');
const fs = require('fs');

const base = 'C:\\Users\\Sergio Ibañez\\.gemini\\antigravity-ide\\brain\\a88f92af-0c44-4878-9636-09ddb03d1b74\\.user_uploaded\\';

function traceBuffer(pngBuf, options = {}) {
  return new Promise((resolve, reject) => {
    potrace.trace(pngBuf, options, (err, svg) => {
      if (err) return reject(err);
      resolve(svg);
    });
  });
}

function extractPath(svg) {
  const match = svg.match(/<path[^>]+d="([^"]+)"/);
  return match ? match[1] : '';
}

async function run() {
  console.log('--- Tracing all logos to authentic vectors ---');

  // 1. Uber Eats
  const uberPng = await sharp('public/icons/uber-eats.png')
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  const uberSvg = await traceBuffer(uberPng, { threshold: 180, optTolerance: 0.2 });
  const uberPath = extractPath(uberSvg);
  fs.writeFileSync('public/icons/uber-eats.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <path fill="currentColor" fill-rule="evenodd" d="${uberPath}" />
</svg>`);
  console.log('✓ Uber Eats SVG done');

  // 2. Rappi (Coral #FF441F)
  const rappiPng = await sharp('public/icons/rappi.png')
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toBuffer();
  const rappiSvg = await traceBuffer(rappiPng, { threshold: 220, optTolerance: 0.2 });
  const rappiPath = extractPath(rappiSvg);
  fs.writeFileSync('public/icons/rappi.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <path fill="#FF441F" fill-rule="evenodd" d="${rappiPath}" />
</svg>`);
  console.log('✓ Rappi SVG done');

  // 3. Amazon: Black letter 'a' + Orange smile '#FF9900'
  const amzRaw = await sharp('public/icons/amazon.png').raw().toBuffer({ resolveWithObject: true });
  const aBuf = Buffer.alloc(amzRaw.info.width * amzRaw.info.height * 4);
  const smileBuf = Buffer.alloc(amzRaw.info.width * amzRaw.info.height * 4);
  for (let i = 0; i < amzRaw.data.length; i += 4) {
    const r = amzRaw.data[i], g = amzRaw.data[i+1], b = amzRaw.data[i+2], a = amzRaw.data[i+3];
    if (a > 40) {
      if (r > 180 && g > 90 && b < 70) {
        // Orange smile
        smileBuf[i] = 0; smileBuf[i+1] = 0; smileBuf[i+2] = 0; smileBuf[i+3] = 255;
      } else if (r < 100 && g < 100 && b < 100) {
        // Black 'a'
        aBuf[i] = 0; aBuf[i+1] = 0; aBuf[i+2] = 0; aBuf[i+3] = 255;
      }
    }
  }
  const aPng = await sharp(aBuf, { raw: { width: amzRaw.info.width, height: amzRaw.info.height, channels: 4 } })
    .flatten({ background: '#ffffff' }).png().toBuffer();
  const smilePng = await sharp(smileBuf, { raw: { width: amzRaw.info.width, height: amzRaw.info.height, channels: 4 } })
    .flatten({ background: '#ffffff' }).png().toBuffer();

  const aSvg = await traceBuffer(aPng, { threshold: 180, optTolerance: 0.2 });
  const smileSvg = await traceBuffer(smilePng, { threshold: 180, optTolerance: 0.2 });
  const aPath = extractPath(aSvg);
  const smilePath = extractPath(smileSvg);

  fs.writeFileSync('public/icons/amazon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <path fill="currentColor" fill-rule="evenodd" d="${aPath}" />
  <path fill="#FF9900" fill-rule="evenodd" d="${smilePath}" />
</svg>`);
  console.log('✓ Amazon SVG done');

  // 4. DiDi Food
  // In media_1791002756997.png, white symbol + "DiDi Food" on orange (#FF7537)
  const didiRaw = await sharp(base + 'media_1791002756997.png').raw().toBuffer({ resolveWithObject: true });
  const didiWhiteBuf = Buffer.alloc(didiRaw.info.width * didiRaw.info.height * 4);
  for (let i = 0; i < didiRaw.data.length; i += 4) {
    const r = didiRaw.data[i], g = didiRaw.data[i+1], b = didiRaw.data[i+2];
    // White text & logo has r > 200, g > 200, b > 200
    if (r > 200 && g > 200 && b > 200) {
      didiWhiteBuf[i] = 0; didiWhiteBuf[i+1] = 0; didiWhiteBuf[i+2] = 0; didiWhiteBuf[i+3] = 255;
    } else {
      didiWhiteBuf[i] = 255; didiWhiteBuf[i+1] = 255; didiWhiteBuf[i+2] = 255; didiWhiteBuf[i+3] = 255;
    }
  }
  const didiWhitePng = await sharp(didiWhiteBuf, { raw: { width: didiRaw.info.width, height: didiRaw.info.height, channels: 4 } })
    .resize(512, 512, { fit: 'contain', background: '#ffffff' })
    .png()
    .toBuffer();
  const didiSvg = await traceBuffer(didiWhitePng, { threshold: 180, optTolerance: 0.2 });
  const didiWhitePath = extractPath(didiSvg);

  fs.writeFileSync('public/icons/didi-food.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="110" fill="#FF7537" />
  <path fill="#FFFFFF" fill-rule="evenodd" d="${didiWhitePath}" />
</svg>`);
  console.log('✓ DiDi Food SVG done');

  // 5. Mercado Libre
  // media_1791002843033.png has yellow oval with blue border and blue handshake, white arms.
  // Let's trace blue paths (#2D3277) and yellow/white background
  const mlRaw = await sharp(base + 'media_1791002843033.png').raw().toBuffer({ resolveWithObject: true });
  // Blue is r < 80, g < 80, b > 100
  // Yellow is r > 200, g > 180, b < 50
  // White is r > 230, g > 230, b > 230
  const mlBlueBuf = Buffer.alloc(mlRaw.info.width * mlRaw.info.height * 4);
  const mlBgBuf = Buffer.alloc(mlRaw.info.width * mlRaw.info.height * 4);
  for (let i = 0; i < mlRaw.data.length; i += 4) {
    const r = mlRaw.data[i], g = mlRaw.data[i+1], b = mlRaw.data[i+2];
    if (r < 80 && g < 80 && b > 80) { // blue lines
      mlBlueBuf[i] = 0; mlBlueBuf[i+1] = 0; mlBlueBuf[i+2] = 0; mlBlueBuf[i+3] = 255;
    } else {
      mlBlueBuf[i] = 255; mlBlueBuf[i+1] = 255; mlBlueBuf[i+2] = 255; mlBlueBuf[i+3] = 255;
    }

    // Oval body (non-transparent/non-white)
    if (r < 240 || g < 240 || b < 240) {
      mlBgBuf[i] = 0; mlBgBuf[i+1] = 0; mlBgBuf[i+2] = 0; mlBgBuf[i+3] = 255;
    } else {
      mlBgBuf[i] = 255; mlBgBuf[i+1] = 255; mlBgBuf[i+2] = 255; mlBgBuf[i+3] = 255;
    }
  }

  const mlBluePng = await sharp(mlBlueBuf, { raw: { width: mlRaw.info.width, height: mlRaw.info.height, channels: 4 } })
    .resize(512, 512, { fit: 'contain', background: '#ffffff' })
    .png().toBuffer();
  const mlBgPng = await sharp(mlBgBuf, { raw: { width: mlRaw.info.width, height: mlRaw.info.height, channels: 4 } })
    .resize(512, 512, { fit: 'contain', background: '#ffffff' })
    .png().toBuffer();

  const mlBlueSvg = await traceBuffer(mlBluePng, { threshold: 180, optTolerance: 0.2 });
  const mlBgSvg = await traceBuffer(mlBgPng, { threshold: 180, optTolerance: 0.2 });
  const mlBluePath = extractPath(mlBlueSvg);
  const mlBgPath = extractPath(mlBgSvg);

  fs.writeFileSync('public/icons/mercadolibre.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <path fill="#FFE600" fill-rule="evenodd" d="${mlBgPath}" />
  <path fill="#2D3277" fill-rule="evenodd" d="${mlBluePath}" />
</svg>`);
  console.log('✓ Mercado Libre SVG done');

  // 6. Shopify
  const shopifySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="shopifyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#95BF47"/>
      <stop offset="100%" stop-color="#5E8E3E"/>
    </linearGradient>
  </defs>
  <path fill="url(#shopifyGrad)" d="M416 142.4c-.6-5-4.4-8.8-9.4-9.4l-95.6-12.6c-3.4-.4-6.8.8-9.2 3.4l-47.4 51.8c-2.1 2.3-5.1 3.6-8.3 3.6s-6.2-1.3-8.3-3.6l-47.4-51.8c-2.4-2.6-5.8-3.8-9.2-3.4L85.4 133c-5 .6-8.8 4.4-9.4 9.4L42.8 468.9c-.6 5.5 2.3 10.9 7.5 13 1.9.8 3.8 1.3 5.8 1.3 3.8 0 7.3-1.7 9.6-4.5l186.7-222.3c2.3-2.8 5.5-4.3 9.2-4.3s6.8 1.5 9.2 4.3l186.7 222.3c2.3 2.8 5.8 4.5 9.6 4.5 2 0 3.8-.4 5.8-1.3 5.1-2.1 8.1-7.5 7.5-13L416 142.4z"/>
  <path fill="#FFFFFF" opacity="0.95" d="M256 28.5c-3.6 0-6.8 1.5-9.2 4.3l-41 48.9c-4.5 5.3-3.8 13.2 1.5 17.7 5.3 4.5 13.2 3.8 17.7-1.5l31-36.9 31 36.9c4.5 5.3 12.4 6 17.7 1.5 5.3-4.5 6-12.4 1.5-17.7l-41-48.9c-2.4-2.8-5.6-4.3-9.2-4.3z"/>
  <path fill="#FFFFFF" d="M285 272c-5.5-2.2-13.8-4.5-21-4.5-15.5 0-25 7.2-25 18 0 29.5 58 20.5 58 59 0 24-18.5 39.5-46 39.5-15 0-26-3.8-32-6.5l4-20c6.5 3.5 16 6.5 25.5 6.5 16 0 24-8 24-18.5 0-31-57.5-22.5-57.5-59 0-23.5 18-38.5 44-38.5 13 0 23.5 3 28.5 5.5l-4.5 18.5z"/>
</svg>`;
  fs.writeFileSync('public/icons/shopify.svg', shopifySvg);
  console.log('✓ Shopify SVG done');
}

run().catch(console.error);
