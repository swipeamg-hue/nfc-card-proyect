/**
 * Antigravity TapCard - Sistema de Tipografías Dinámicas
 * Incluye catálogo de Google Fonts categorizadas y soporte para fuentes personalizadas (.ttf, .woff, .woff2)
 */

export interface FontOption {
  id: string;
  name: string;
  category: 'sans-serif' | 'serif' | 'handwriting' | 'display' | 'monospace';
  categoryLabel: string;
  previewText?: string;
  weights: string[];
}

export const POPULAR_FONTS: FontOption[] = [
  // --- Sans-Serif (Moderno / Tech / Deportivo - Estilo Pulse Fit) ---
  { id: 'Inter', name: 'Inter', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '600', '700'], previewText: 'Moderno, limpio y profesional' },
  { id: 'Montserrat', name: 'Montserrat', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '600', '700', '800'], previewText: 'Deportivo, enérgico y audaz' },
  { id: 'Outfit', name: 'Outfit', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '500', '700'], previewText: 'Vanguardista y geométrico' },
  { id: 'Poppins', name: 'Poppins', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '600', '700'], previewText: 'Amigable, redondeado y legible' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '600', '700'], previewText: 'Estilo tech SaaS de alta gama' },
  { id: 'Space Grotesk', name: 'Space Grotesk', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '600', '700'], previewText: 'Futurista y tecnológico' },
  { id: 'Oswald', name: 'Oswald', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '600', '700'], previewText: 'Condensado, fitness y alta presencia' },
  { id: 'Raleway', name: 'Raleway', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '600', '700'], previewText: 'Elegancia arquitectónica y fina' },
  { id: 'Roboto', name: 'Roboto', category: 'sans-serif', categoryLabel: 'Sans-Serif', weights: ['400', '500', '700'], previewText: 'Clásico y de máxima legibilidad' },

  // --- Serif (Elegante / Editorial / Cafetería - Estilo Casa Miel) ---
  { id: 'Playfair Display', name: 'Playfair Display', category: 'serif', categoryLabel: 'Serif Clásica', weights: ['400', '600', '700'], previewText: 'Editorial, moda y buen café' },
  { id: 'Cinzel', name: 'Cinzel', category: 'serif', categoryLabel: 'Serif Clásica', weights: ['400', '600', '700'], previewText: 'Lujo imperial, arquitectura y vinos' },
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond', category: 'serif', categoryLabel: 'Serif Clásica', weights: ['400', '600', '700'], previewText: 'Romance clásico, refinado y poético' },
  { id: 'Lora', name: 'Lora', category: 'serif', categoryLabel: 'Serif Clásica', weights: ['400', '600', '700'], previewText: 'Calidez literaria contemporánea' },
  { id: 'Merriweather', name: 'Merriweather', category: 'serif', categoryLabel: 'Serif Clásica', weights: ['400', '700'], previewText: 'Editorial agradable y confiable' },
  { id: 'Bodoni Moda', name: 'Bodoni Moda', category: 'serif', categoryLabel: 'Serif Clásica', weights: ['400', '600', '800'], previewText: 'Alta costura y sofisticación' },
  { id: 'Prata', name: 'Prata', category: 'serif', categoryLabel: 'Serif Clásica', weights: ['400'], previewText: 'Delicadeza, té y repostería artesanal' },

  // --- Script & Caligrafía (Bodas / Eventos / Romántico - Estilo Sofía & Alejandro) ---
  { id: 'Great Vibes', name: 'Great Vibes', category: 'handwriting', categoryLabel: 'Caligrafía / Bodas', weights: ['400'], previewText: 'Sofía & Alejandro • Invitación Real' },
  { id: 'Dancing Script', name: 'Dancing Script', category: 'handwriting', categoryLabel: 'Caligrafía / Bodas', weights: ['400', '700'], previewText: 'Espontánea, cálida y festiva' },
  { id: 'Alex Brush', name: 'Alex Brush', category: 'handwriting', categoryLabel: 'Caligrafía / Bodas', weights: ['400'], previewText: 'Trazos fluidos de invitación de gala' },
  { id: 'Parisienne', name: 'Parisienne', category: 'handwriting', categoryLabel: 'Caligrafía / Bodas', weights: ['400'], previewText: 'Romance francés, sutil y elegante' },
  { id: 'Sacramento', name: 'Sacramento', category: 'handwriting', categoryLabel: 'Caligrafía / Bodas', weights: ['400'], previewText: 'Firma fina de boutique exclusiva' },
  { id: 'Allura', name: 'Allura', category: 'handwriting', categoryLabel: 'Caligrafía / Bodas', weights: ['400'], previewText: 'Caligrafía nupcial de alto prestigio' },
  { id: 'Satisfy', name: 'Satisfy', category: 'handwriting', categoryLabel: 'Caligrafía / Bodas', weights: ['400'], previewText: 'Café que une con amor' },

  // --- Display / Impacto ---
  { id: 'Bebas Neue', name: 'Bebas Neue', category: 'display', categoryLabel: 'Display / Impacto', weights: ['400'], previewText: 'DISCIPLINA HOY • RESULTADOS SIEMPRE' },
  { id: 'Righteous', name: 'Righteous', category: 'display', categoryLabel: 'Display / Impacto', weights: ['400'], previewText: 'Urbano, audaz y retro-moderno' },
  { id: 'Abril Fatface', name: 'Abril Fatface', category: 'display', categoryLabel: 'Display / Impacto', weights: ['400'], previewText: 'Tipografía de cartel publicitario' },
  { id: 'Syne', name: 'Syne', category: 'display', categoryLabel: 'Display / Impacto', weights: ['700', '800'], previewText: 'Brutalista, artístico y contemporáneo' },

  // --- Monospace (Tech / Código) ---
  { id: 'JetBrains Mono', name: 'JetBrains Mono', category: 'monospace', categoryLabel: 'Monospace', weights: ['400', '600'], previewText: 'NFC_CODE::AUTHENTICATED' },
  { id: 'Space Mono', name: 'Space Mono', category: 'monospace', categoryLabel: 'Monospace', weights: ['400', '700'], previewText: 'Cyberpunk & Web3 Tech' },
];

/**
 * Carga dinámicamente una Google Font o registra una fuente personalizada en el DOM
 */
const loadedFonts = new Set<string>();

export function dynamicallyLoadFont(fontFamily: string, customFontUrl?: string, customFontName?: string) {
  if (typeof window === 'undefined') return;

  // 1. Carga de fuente personalizada subida por el usuario
  if (customFontUrl && customFontName) {
    const fontId = `custom-font-${customFontName.toLowerCase().replace(/\s+/g, '-')}`;
    let style = document.getElementById(fontId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement('style');
      style.id = fontId;
      document.head.appendChild(style);
    }
    style.textContent = `
      @font-face {
        font-family: '${customFontName}';
        src: url('${customFontUrl}') format('woff2'),
             url('${customFontUrl}') format('woff'),
             url('${customFontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    loadedFonts.add(customFontName);
    return;
  }

  // 2. Carga de Google Font
  if (!fontFamily || fontFamily === 'system-ui') {
    return;
  }

  const cleanFamily = fontFamily.trim();
  const linkId = `gfont-${cleanFamily.toLowerCase().replace(/\s+/g, '-')}`;

  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    const formattedFamily = cleanFamily.replace(/ /g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${formattedFamily}&display=swap`;
    document.head.appendChild(link);
    loadedFonts.add(cleanFamily);

    // Dynamic WebFont Loader for immediate browser font cache
    try {
      import('webfontloader').then((WebFont) => {
        WebFont.load({
          google: {
            families: [cleanFamily],
          },
        });
      });
    } catch {}
  }
}
