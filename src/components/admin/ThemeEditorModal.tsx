import React, { useState } from 'react';
import { X, Palette, Check, RotateCcw, Sparkles, Sun, Moon } from 'lucide-react';
import { GalleryTheme, PresetThemeId } from '../../types';
import { THEME_PRESETS, applyThemeToDocument, defaultTheme } from '../../data/themes';
import { updateTheme } from '../../services/api';

interface ThemeEditorModalProps {
  isOpen: boolean;
  currentTheme: GalleryTheme;
  onClose: () => void;
  onThemeSaved: (theme: GalleryTheme) => void;
}

export const ThemeEditorModal: React.FC<ThemeEditorModalProps> = ({
  isOpen,
  currentTheme,
  onClose,
  onThemeSaved,
}) => {
  const [activeTheme, setActiveTheme] = useState<GalleryTheme>(currentTheme);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: GalleryTheme) => {
    setActiveTheme(preset);
    applyThemeToDocument(preset);
    setFeedback(`Applied preset: ${preset.name}`);
    setTimeout(() => setFeedback(null), 2000);
  };

  const handleColorChange = (key: keyof GalleryTheme, val: string) => {
    const updated: GalleryTheme = {
      ...activeTheme,
      id: 'custom',
      [key]: val,
    };
    setActiveTheme(updated);
    applyThemeToDocument(updated);
  };

  const handleSaveTheme = async () => {
    setIsSaving(true);
    setFeedback(null);
    try {
      await updateTheme(activeTheme);
      onThemeSaved(activeTheme);
      setFeedback('Theme and website colors saved successfully as default!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setFeedback(err.message || 'Failed to save theme.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefault = () => {
    setActiveTheme(defaultTheme);
    applyThemeToDocument(defaultTheme);
    setFeedback('Restored to default Alabaster Museum palette.');
    setTimeout(() => setFeedback(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Website Themes and Colors Editor"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div
        className="w-full max-w-2xl bg-white border border-stone-300 shadow-2xl rounded-sm p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto text-stone-900"
        style={{
          backgroundColor: activeTheme.bgSurface,
          color: activeTheme.textPrimary,
          borderColor: activeTheme.borderColor,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b mb-6" style={{ borderColor: activeTheme.borderColor }}>
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-stone-700" style={{ color: activeTheme.accentColor }} />
            <div>
              <h2 className="font-serif text-2xl font-light">
                Website Themes &amp; Live Colors
              </h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                Switch curated museum palettes or customize colors live across the entire portfolio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Theme Editor"
            className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {feedback && (
          <div
            className="p-3 mb-6 text-xs rounded-sm flex items-center gap-2 font-mono"
            style={{
              backgroundColor: activeTheme.bgSubtle,
              border: `1px solid ${activeTheme.borderColor}`,
              color: activeTheme.textPrimary,
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Section 1: Curated Museum Presets */}
        <div className="mb-8">
          <label className="block text-xs uppercase tracking-widest font-mono text-stone-500 mb-3 font-semibold">
            1. Curated Gallery Palettes (1-Click Live Switch)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEME_PRESETS.map((preset) => {
              const isSelected = activeTheme.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3.5 text-left border rounded-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected ? 'ring-2 ring-stone-900 shadow-md' : 'hover:border-stone-400'
                  }`}
                  style={{
                    backgroundColor: preset.bgSurface,
                    borderColor: preset.borderColor,
                    color: preset.textPrimary,
                  }}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-medium block">
                      {preset.name}
                    </span>
                    {/* Swatch chips */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.bgCanvas }}
                        title="Canvas"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.bgSurface }}
                        title="Surface"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.accentColor }}
                        title="Accent"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.textPrimary }}
                        title="Text"
                      />
                    </div>
                  </div>

                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: preset.accentColor, color: preset.accentContrast }}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Custom Fine-Tuning Swatches */}
        <div className="mb-8 pt-6 border-t" style={{ borderColor: activeTheme.borderColor }}>
          <div className="flex items-center justify-between mb-4">
            <label className="text-xs uppercase tracking-widest font-mono text-stone-500 font-semibold">
              2. Custom Color Calibration
            </label>
            <span className="text-[11px] font-mono text-stone-400">
              Live updates applied immediately
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Canvas Background */}
            <div className="p-3 border rounded-sm space-y-1.5" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider">Canvas Background</span>
                <span className="font-mono text-[11px] opacity-70">{activeTheme.bgCanvas}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.bgCanvas}
                  onChange={(e) => handleColorChange('bgCanvas', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={activeTheme.bgCanvas}
                  onChange={(e) => handleColorChange('bgCanvas', e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono border rounded-xs"
                  style={{ borderColor: activeTheme.borderColor }}
                />
              </div>
            </div>

            {/* Card & Surface */}
            <div className="p-3 border rounded-sm space-y-1.5" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider">Card / Surface</span>
                <span className="font-mono text-[11px] opacity-70">{activeTheme.bgSurface}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.bgSurface}
                  onChange={(e) => handleColorChange('bgSurface', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={activeTheme.bgSurface}
                  onChange={(e) => handleColorChange('bgSurface', e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono border rounded-xs"
                  style={{ borderColor: activeTheme.borderColor }}
                />
              </div>
            </div>

            {/* Subtle / Alt Background */}
            <div className="p-3 border rounded-sm space-y-1.5" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider">Subtle Accent Sections</span>
                <span className="font-mono text-[11px] opacity-70">{activeTheme.bgSubtle}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.bgSubtle}
                  onChange={(e) => handleColorChange('bgSubtle', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={activeTheme.bgSubtle}
                  onChange={(e) => handleColorChange('bgSubtle', e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono border rounded-xs"
                  style={{ borderColor: activeTheme.borderColor }}
                />
              </div>
            </div>

            {/* Primary Ink */}
            <div className="p-3 border rounded-sm space-y-1.5" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider">Primary Text Ink</span>
                <span className="font-mono text-[11px] opacity-70">{activeTheme.textPrimary}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.textPrimary}
                  onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={activeTheme.textPrimary}
                  onChange={(e) => handleColorChange('textPrimary', e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono border rounded-xs"
                  style={{ borderColor: activeTheme.borderColor }}
                />
              </div>
            </div>

            {/* Border Lines */}
            <div className="p-3 border rounded-sm space-y-1.5" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider">Architectural Borders</span>
                <span className="font-mono text-[11px] opacity-70">{activeTheme.borderColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.borderColor}
                  onChange={(e) => handleColorChange('borderColor', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={activeTheme.borderColor}
                  onChange={(e) => handleColorChange('borderColor', e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono border rounded-xs"
                  style={{ borderColor: activeTheme.borderColor }}
                />
              </div>
            </div>

            {/* Accent Buttons */}
            <div className="p-3 border rounded-sm space-y-1.5" style={{ borderColor: activeTheme.borderColor }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono text-[11px] uppercase tracking-wider">Primary Accent / Buttons</span>
                <span className="font-mono text-[11px] opacity-70">{activeTheme.accentColor}</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={activeTheme.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-8 h-8 rounded border border-stone-300 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={activeTheme.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  className="w-full px-2 py-1 text-xs font-mono border rounded-xs"
                  style={{ borderColor: activeTheme.borderColor }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Sample Card */}
        <div
          className="p-5 border rounded-sm mb-8 space-y-3"
          style={{
            backgroundColor: activeTheme.bgCanvas,
            borderColor: activeTheme.borderColor,
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-400 block">
            Real-Time Sample Preview
          </span>
          <div
            className="p-4 border rounded-sm shadow-xs flex items-center justify-between"
            style={{
              backgroundColor: activeTheme.bgSurface,
              borderColor: activeTheme.borderColor,
              color: activeTheme.textPrimary,
            }}
          >
            <div>
              <p className="font-serif text-lg">Navid Ali Bhatti — Monolith Series</p>
              <p className="text-xs" style={{ color: activeTheme.textSecondary }}>
                Archival Carbon Pigment Print · 180 × 120 cm
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 text-xs uppercase tracking-wider font-medium rounded-sm shadow-xs"
              style={{
                backgroundColor: activeTheme.accentColor,
                color: activeTheme.accentContrast,
              }}
            >
              Acquire
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: activeTheme.borderColor }}>
          <button
            type="button"
            onClick={handleResetDefault}
            className="text-xs uppercase tracking-wider flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity cursor-pointer font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Alabaster Default</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider opacity-70 hover:opacity-100 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveTheme}
              disabled={isSaving}
              className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium rounded-sm shadow-sm transition-opacity hover:opacity-90 cursor-pointer flex items-center gap-2"
              style={{
                backgroundColor: activeTheme.accentColor,
                color: activeTheme.accentContrast,
              }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving Theme...' : 'Save Theme As Default'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
