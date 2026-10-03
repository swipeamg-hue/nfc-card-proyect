const fs = require('fs');

function getPaths(file) {
  const content = fs.readFileSync('public/icons/' + file, 'utf8');
  const matches = [...content.matchAll(/d="([^"]+)"/g)];
  return matches.map(m => m[1]);
}

const uberPaths = getPaths('uber-eats.svg');
const rappiPaths = getPaths('rappi.svg');
const amazonPaths = getPaths('amazon.svg');
const didiPaths = getPaths('didi-food.svg');
const mlPaths = getPaths('mercadolibre.svg');

const code = `// Rutas de vectores oficiales generados a partir de las imágenes de alta fidelidad
export const UBER_EATS_PATH = ${JSON.stringify(uberPaths[0] || '')};

export const RAPPI_PATH = ${JSON.stringify(rappiPaths[0] || '')};

export const AMAZON_A_PATH = ${JSON.stringify(amazonPaths[0] || '')};
export const AMAZON_SMILE_PATH = ${JSON.stringify(amazonPaths[1] || '')};

export const DIDI_WHITE_PATH = ${JSON.stringify(didiPaths[0] || '')};

export const MERCADOLIBRE_YELLOW_PATH = ${JSON.stringify(mlPaths[0] || '')};
export const MERCADOLIBRE_BLUE_PATH = ${JSON.stringify(mlPaths[1] || '')};
`;

fs.writeFileSync('components/ui/brand-paths.ts', code);
console.log('✓ components/ui/brand-paths.ts generated successfully');
