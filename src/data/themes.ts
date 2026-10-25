import { GalleryTheme } from '../types';

export const THEME_STORAGE_KEY = 'nab_theme_v2';

export const THEME_PRESETS: GalleryTheme[] = [
  {
    id: 'alabaster',
    name: 'Alabaster Museum (Luxury White & Gold)',
    bgCanvas: '#faf9f6',
    bgSurface: '#ffffff',
    bgSubtle: '#f4f2ee',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    textMuted: '#78716c',
    borderColor: '#e5e3dc',
    accentColor: '#b8860b',
    accentContrast: '#faf9f6',
    isDark: false,
  },
  {
    id: 'obsidian_darkroom',
    name: 'Obsidian Nocturne (Cinematic Dark)',
    bgCanvas: '#090a0c',
    bgSurface: '#121418',
    bgSubtle: '#181b21',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    borderColor: '#27272a',
    accentColor: '#d4af37',
    accentContrast: '#090a0c',
    isDark: true,
  },
  {
    id: 'royal_gold',
    name: 'Royal Gold & Ivory Velvet',
    bgCanvas: '#fcfaf2',
    bgSurface: '#ffffff',
    bgSubtle: '#f7f1df',
    textPrimary: '#261b0c',
    textSecondary: '#6e5630',
    textMuted: '#947a4d',
    borderColor: '#ebdcb6',
    accentColor: '#b8860b',
    accentContrast: '#fcfaf2',
    isDark: false,
  },
  {
    id: 'emerald_studio',
    name: 'Emerald Atelier (Dark Forest & Sage)',
    bgCanvas: '#0b1612',
    bgSurface: '#11221c',
    bgSubtle: '#183129',
    textPrimary: '#e8f5f0',
    textSecondary: '#9ec4b6',
    textMuted: '#649583',
    borderColor: '#1f4236',
    accentColor: '#34d399',
    accentContrast: '#0b1612',
    isDark: true,
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Violet (Digital Lab)',
    bgCanvas: '#0c0d18',
    bgSurface: '#131526',
    bgSubtle: '#1b1d36',
    textPrimary: '#f5f3ff',
    textSecondary: '#c4b5fd',
    textMuted: '#8b5cf6',
    borderColor: '#2e2b52',
    accentColor: '#a855f7',
    accentContrast: '#ffffff',
    isDark: true,
  },
  {
    id: 'bauhaus_blue',
    name: 'Bauhaus Modernist (Ultramarine)',
    bgCanvas: '#f5f6f8',
    bgSurface: '#ffffff',
    bgSubtle: '#e8ecf2',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    borderColor: '#cbd5e1',
    accentColor: '#1d4ed8',
    accentContrast: '#ffffff',
    isDark: false,
  },
  {
    id: 'terracotta',
    name: 'Terracotta & Raw Linen (Sketchbook)',
    bgCanvas: '#faf5f0',
    bgSurface: '#ffffff',
    bgSubtle: '#f2e6dc',
    textPrimary: '#38251e',
    textSecondary: '#785548',
    textMuted: '#a17869',
    borderColor: '#e6d3c4',
    accentColor: '#c25e38',
    accentContrast: '#ffffff',
    isDark: false,
  },
  {
    id: 'pure_white',
    name: 'Pure Minimalist Blanc (High Key)',
    bgCanvas: '#ffffff',
    bgSurface: '#fafafa',
    bgSubtle: '#f3f4f6',
    textPrimary: '#09090b',
    textSecondary: '#52525b',
    textMuted: '#71717a',
    borderColor: '#e4e4e7',
    accentColor: '#09090b',
    accentContrast: '#ffffff',
    isDark: false,
  },
];

export const defaultTheme: GalleryTheme = THEME_PRESETS[0];

export function getStoredTheme(): GalleryTheme {
  if (typeof window === 'undefined') return defaultTheme;
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.bgCanvas && parsed.textPrimary) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read theme from localStorage', e);
  }
  return defaultTheme;
}

export function saveStoredTheme(theme: GalleryTheme): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
  } catch (e) {
    console.warn('Could not save theme to localStorage', e);
  }
}

export function applyThemeToDocument(theme: GalleryTheme) {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--bg-canvas', theme.bgCanvas);
  root.style.setProperty('--bg-surface', theme.bgSurface);
  root.style.setProperty('--bg-subtle', theme.bgSubtle);
  root.style.setProperty('--text-primary', theme.textPrimary);
  root.style.setProperty('--text-secondary', theme.textSecondary);
  root.style.setProperty('--text-muted', theme.textMuted);
  root.style.setProperty('--border-color', theme.borderColor);
  root.style.setProperty('--accent-color', theme.accentColor);
  root.style.setProperty('--accent-contrast', theme.accentContrast);

  if (theme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Update body background
  document.body.style.backgroundColor = theme.bgCanvas;
  document.body.style.color = theme.textPrimary;

  // Persist locally for instant reload
  saveStoredTheme(theme);
}
