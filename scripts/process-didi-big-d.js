const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

const base = 'C:\\Users\\Sergio Ibañez\\.gemini\\antigravity-ide\\brain\\a88f92af-0c44-4878-9636-09ddb03d1b74\\.user_uploaded\\media_1791002756997.png';

async function processDidiBigD() {
  const meta = await sharp(base).metadata();
  console.log('Original DiDi image:', meta.width, 'x', meta.height);

  // In the image, the top half (around y: 20% to 55%) is the D emblem.
  // The bottom half (y: 55% to 75%) is "DiDi Food".
  // Let's inspect white pixels only in the top half:
  const raw = await sharp(base).raw().toBuffer({ resolveWithObject: true });
  const w = raw.info.width;
  const h = raw.info.height;

  // Let's create an image with ONLY the top D emblem (zeroing out anything below y = 0.52 * h)
  const dOnlyBuf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = raw.data[idx];
      const g = raw.data[idx+1];
      const b = raw.data[idx+2];
      // Only keep white pixels in the top 54% of the image (the D emblem)
      if (y < h * 0.54 && r > 180 && g > 180 && b > 180) {
        dOnlyBuf[idx] = 255;
        dOnlyBuf[idx+1] = 255;
        dOnlyBuf[idx+2] = 255;
        dOnlyBuf[idx+3] = 255;
      } else {
        dOnlyBuf[idx] = 0;
        dOnlyBuf[idx+1] = 0;
        dOnlyBuf[idx+2] = 0;
        dOnlyBuf[idx+3] = 0;
      }
    }
  }

  // Trim to get tight bounds of just the D emblem
  const trimmed = await sharp(dOnlyBuf, { raw: { width: w, height: h, channels: 4 } })
    .trim()
    .toBuffer({ resolveWithObject: true });

  console.log('Trimmed D emblem size:', trimmed.info.width, 'x', trimmed.info.height);

  // Now create a 512x512 icon:
  // Center the D emblem and give it a prominent, generous size (e.g. 300px wide, perfectly centered)
  // Background: official orange #FF7537 with rounded corners rx=110
  const dResized = await sharp(trimmed.data)
    .resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer({ resolveWithObject: true });

  // Place it centered on 512x512
  const topOffset = Math.round((512 - dResized.info.height) / 2);
  const leftOffset = Math.round((512 - dResized.info.width) / 2);

  const finalPng = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 117, b: 55, alpha: 1 } // #FF7537
    }
  })
    .composite([{ input: dResized.data, top: topOffset, left: leftOffset }])
    .toBuffer();

  // Apply rounded mask for the PNG
  const mask = Buffer.from(
    `<svg width="512" height="512"><rect x="0" y="0" width="512" height="512" rx="110" ry="110" fill="#fff"/></svg>`
  );
  await sharp(finalPng)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile('public/icons/didi-food.png');
  console.log('✓ public/icons/didi-food.png generated with BIG D emblem');

  // Now trace the D emblem to vector SVG
  // Prepare a black on white version for potrace of just the centered D
  const dForTrace = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  })
    .composite([{
      input: await sharp(dResized.data)
        .negate({ alpha: false }) // make white D into black
        .toBuffer(),
      top: topOffset,
      left: leftOffset
    }])
    .png()
    .toBuffer();

  potrace.trace(dForTrace, { threshold: 180, optTolerance: 0.2 }, (err, svg) => {
    if (err) throw err;
    const match = svg.match(/<path[^>]+d="([^"]+)"/);
    const dPath = match ? match[1] : '';

    const didiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="110" fill="#FF7537" />
  <path fill="#FFFFFF" fill-rule="evenodd" d="${dPath}" />
</svg>`;

    fs.writeFileSync('public/icons/didi-food.svg', didiSvg);
    console.log('✓ public/icons/didi-food.svg generated with BIG D emblem and NO text');

    // Also export the path string to a test file so we can update brand-paths.ts
    fs.writeFileSync('public/icons/didi-d-path.txt', dPath);
  });
}

processDidiBigD().catch(console.error);
