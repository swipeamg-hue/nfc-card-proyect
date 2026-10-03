const sharp = require('sharp');
const fs = require('fs');

async function check() {
  const icons = ['uber-eats', 'didi-food', 'rappi', 'mercadolibre', 'amazon', 'shopify'];
  for (const name of icons) {
    try {
      const svgBuf = fs.readFileSync(`public/icons/${name}.svg`);
      const pngBuf = await sharp(svgBuf)
        .resize(256, 256, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer();
      fs.writeFileSync(`public/icons/preview-${name}.png`, pngBuf);
      console.log(`✓ preview-${name}.png rendered cleanly`);
    } catch (err) {
      console.error(`✗ Error rendering ${name}:`, err.message);
    }
  }
}

check();
