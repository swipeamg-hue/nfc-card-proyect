const potrace = require('potrace');
const sharp = require('sharp');
const fs = require('fs');

async function testTrace() {
  // 1. Uber Eats
  // Take public/icons/uber-eats.png (which is black text on transparent)
  // Put it on white background for potrace
  const uberBw = await sharp('public/icons/uber-eats.png')
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();

  potrace.trace(uberBw, { threshold: 180, optTolerance: 0.2 }, (err, svg) => {
    if (err) throw err;
    fs.writeFileSync('public/icons/uber-eats.svg', svg);
    console.log('✓ Uber Eats SVG generated');
  });

  // 3. Rappi
  const rappiBw = await sharp('public/icons/rappi.png')
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .toBuffer();

  potrace.trace(rappiBw, { threshold: 220, optTolerance: 0.2, color: '#FF441F' }, (err, svg) => {
    if (err) throw err;
    fs.writeFileSync('public/icons/rappi.svg', svg);
    console.log('✓ Rappi SVG generated');
  });

  // 5. Amazon: We can trace the 'a' and the 'smile' separately to preserve two colors!
  // Amazon 'a' is dark, smile is orange (#FF9900)
  const amzPng = await sharp('public/icons/amazon.png').raw().toBuffer({ resolveWithObject: true });
  // separate black 'a' and orange smile
  const aBuf = Buffer.alloc(amzPng.info.width * amzPng.info.height * 4);
  const smileBuf = Buffer.alloc(amzPng.info.width * amzPng.info.height * 4);
  for (let i = 0; i < amzPng.data.length; i += 4) {
    const r = amzPng.data[i], g = amzPng.data[i+1], b = amzPng.data[i+2], a = amzPng.data[i+3];
    if (a > 30) {
      if (r > 200 && g > 100 && b < 80) { // orange smile
        smileBuf[i] = 0; smileBuf[i+1] = 0; smileBuf[i+2] = 0; smileBuf[i+3] = 255;
        aBuf[i] = 255; aBuf[i+1] = 255; aBuf[i+2] = 255; aBuf[i+3] = 0;
      } else if (r < 100 && g < 100 && b < 100) { // black 'a'
        aBuf[i] = 0; aBuf[i+1] = 0; aBuf[i+2] = 0; aBuf[i+3] = 255;
        smileBuf[i] = 255; smileBuf[i+1] = 255; smileBuf[i+2] = 255; smileBuf[i+3] = 0;
      }
    }
  }
  const aJpg = await sharp(aBuf, { raw: { width: amzPng.info.width, height: amzPng.info.height, channels: 4 } })
    .flatten({ background: '#ffffff' }).toBuffer();
  const smileJpg = await sharp(smileBuf, { raw: { width: amzPng.info.width, height: amzPng.info.height, channels: 4 } })
    .flatten({ background: '#ffffff' }).toBuffer();

  potrace.trace(aJpg, { threshold: 180, color: '#000000' }, (err, aSvg) => {
    potrace.trace(smileJpg, { threshold: 180, color: '#FF9900' }, (err2, smileSvg) => {
      // Extract path d from both
      const aPath = aSvg.match(/d="([^"]+)"/)?.[1] || '';
      const smilePath = smileSvg.match(/d="([^"]+)"/)?.[1] || '';
      const combinedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <path fill="#000000" d="${aPath}" />
  <path fill="#FF9900" d="${smilePath}" />
</svg>`;
      fs.writeFileSync('public/icons/amazon.svg', combinedSvg);
      console.log('✓ Amazon SVG generated');
    });
  });
}

testTrace();
