import { GalleryTheme } from '../types';

export const THEME_PRESETS: GalleryTheme[] = [
  {
    id: 'alabaster',
    name: 'Alabaster Museum (Warm White)',
    bgCanvas: '#faf9f6',
    bgSurface: '#ffffff',
    bgSubtle: '#f4f2ee',
    textPrimary: '#1c1917',
    textSecondary: '#57534e',
    textMuted: '#78716c',
    borderColor: '#e5e3dc',
    accentColor: '#1c1917',
    accentContrast: '#faf9f6',
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
  {
    id: 'warm_champagne',
    name: 'Champagne & Fine Bronze',
    bgCanvas: '#faf7f2',
    bgSurface: '#ffffff',
    bgSubtle: '#f2eae0',
    textPrimary: '#231d18',
    textSecondary: '#66594d',
    textMuted: '#8f7d6e',
    borderColor: '#e7ded4',
    accentColor: '#966d3a',
    accentContrast: '#ffffff',
    isDark: false,
  },
  {
    id: 'sandstone',
    name: 'Raw Sandstone & Cast Linen',
    bgCanvas: '#f5f2eb',
    bgSurface: '#fdfbf7',
    bgSubtle: '#eae4d7',
    textPrimary: '#28231f',
    textSecondary: '#5e544c',
    textMuted: '#877a70',
    borderColor: '#ded5c5',
    accentColor: '#362f2a',
    accentContrast: '#f5f2eb',
    isDark: false,
  },
  {
    id: 'nordic_slate',
    name: 'Nordic Slate & Ice Fog',
    bgCanvas: '#f0f3f5',
    bgSurface: '#ffffff',
    bgSubtle: '#e2e8ec',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    borderColor: '#cfdbe2',
    accentColor: '#1e293b',
    accentContrast: '#f8fafc',
    isDark: false,
  },
  {
    id: 'obsidian_darkroom',
    name: 'Obsidian Darkroom (Cinematic Dark)',
    bgCanvas: '#090a0c',
    bgSurface: '#121418',
    bgSubtle: '#181b21',
    textPrimary: '#f4f4f5',
    textSecondary: '#a1a1aa',
    textMuted: '#71717a',
    borderColor: '#27272a',
    accentColor: '#ffffff',
    accentContrast: '#090a0c',
    isDark: true,
  },
];

export const defaultTheme: GalleryTheme = THEME_PRESETS[0];

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
}
