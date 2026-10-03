const fs = require('fs');

let content = fs.readFileSync('components/ui/brand-paths.ts', 'utf8');

// Replace DIDI_WHITE_PATH with the clean inverted D path:
const didiDPath = "M29.25,11.7v5.01c0,6.17-5.05,11.16-11.24,11.05-6.06-.1-10.87-5.17-10.87-11.24v-3.96c0-.48.39-.87.87-.87h21.24v-6.59H1.7c-.94,0-1.7.76-1.7,1.7v9.29c0,10.03,8.03,18.35,18.06,18.42,10.11.07,18.33-8.1,18.33-18.2v-4.63h-7.14Z";

content = content.replace(/export const DIDI_WHITE_PATH = "[^"]+";/, `export const DIDI_WHITE_PATH = "${didiDPath}";`);

// Add ONLYFANS_PATH if not present:
const onlyFansPath = "M24 4.003h-4.015c-3.45 0-5.3.197-6.748 1.957a7.996 7.996 0 1 0 2.103 9.211c3.182-.231 5.39-2.134 6.085-5.173 0 0-2.399.585-4.43 0 4.018-.777 6.333-3.037 7.005-5.995zM5.61 11.999A2.391 2.391 0 0 1 9.28 9.97a2.966 2.966 0 0 1 2.998-2.528h.008c-.92 1.778-1.407 3.352-1.998 5.263A2.392 2.392 0 0 1 5.61 12Zm2.386-7.996a7.996 7.996 0 1 0 7.996 7.996 7.996 7.996 0 0 0-7.996-7.996Zm0 10.394A2.399 2.399 0 1 1 10.395 12a2.396 2.396 0 0 1-2.399 2.398Z";

if (!content.includes('ONLYFANS_PATH')) {
  content += `\nexport const ONLYFANS_PATH = "${onlyFansPath}";\n`;
}

fs.writeFileSync('components/ui/brand-paths.ts', content);
console.log('✓ components/ui/brand-paths.ts updated with clean DiDi D and OnlyFans path');
