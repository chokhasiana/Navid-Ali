import React, { useState } from 'react';
import { Plus, Palette, Edit3, Lock, Unlock, BookOpen, Camera, Check } from 'lucide-react';
import { LionFaceLogo } from '../common/LionFaceLogo';
import { GalleryTheme } from '../../types';
import { THEME_PRESETS, applyThemeToDocument } from '../../data/themes';

interface MobileEditBarProps {
  isCuratorLoggedIn: boolean;
  isEditModeActive: boolean;
  currentTheme: GalleryTheme;
  onToggleEditMode: () => void;
  onOpenUploadArtwork: () => void;
  onOpenCreateBlogPost: () => void;
  onOpenCuratorAuth: () => void;
  onOpenThemeEditor: () => void;
  onSelectThemePreset: (theme: GalleryTheme) => void;
}

export const MobileEditBar: React.FC<MobileEditBarProps> = ({
  isCuratorLoggedIn,
  isEditModeActive,
  currentTheme,
  onToggleEditMode,
  onOpenUploadArtwork,
  onOpenCreateBlogPost,
  onOpenCuratorAuth,
  onOpenThemeEditor,
  onSelectThemePreset,
}) => {
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);

  return (
    <>
      {/* Floating Mobile Dock (Visible on mobile/tablet screens < 768px) */}
      <aside
        aria-label="Mobiles Bearbeitungsmenü"
        className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-stone-950/92 backdrop-blur-xl border border-white/15 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-2 text-white transition-all duration-300"
      >
        <div className="flex items-center justify-between gap-1">
          {/* Brand watermark indicator */}
          <div className="hidden xs:flex items-center gap-1.5 pl-2 pr-1 shrink-0">
            <LionFaceLogo size={18} color="#d4af37" />
            <span className="font-serif text-[11px] uppercase tracking-wider text-gold-light font-light truncate max-w-[65px]">
              Studio
            </span>
          </div>

          {/* Action 1: Upload new art (Camera/Gallery) */}
          <button
            onClick={() => {
              if (!isCuratorLoggedIn) {
                onOpenCuratorAuth();
              } else {
                onOpenUploadArtwork();
              }
            }}
            className="flex-1 min-h-[46px] px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm cursor-pointer"
            title="Neues Werk / Foto hochladen"
          >
            <Camera className="w-4 h-4 shrink-0" />
            <span className="font-medium whitespace-nowrap text-[11px] sm:text-xs">+ Kunstwerk</span>
          </button>

          {/* Action 2: Write blog post */}
          <button
            onClick={() => {
              if (!isCuratorLoggedIn) {
                onOpenCuratorAuth();
              } else {
                onOpenCreateBlogPost();
              }
            }}
            className="flex-1 min-h-[46px] px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer border border-white/10"
            title="Neuen Blogbeitrag verfassen"
          >
            <BookOpen className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap text-[11px] sm:text-xs">+ Blog</span>
          </button>

          {/* Action 3: Quick Color Theme Sheet */}
          <button
            onClick={() => setIsThemeSheetOpen(!isThemeSheetOpen)}
            className="min-h-[46px] min-w-[46px] p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white flex items-center justify-center active:scale-95 transition-all cursor-pointer border border-white/10 shrink-0"
            title="Farbpaletten & Themes"
            aria-label="Farben wählen"
          >
            <Palette className="w-4 h-4 text-[#d4af37]" />
          </button>

          {/* Action 4: Edit Mode Toggle / Passkey lock */}
          <button
            onClick={() => {
              if (!isCuratorLoggedIn) {
                onOpenCuratorAuth();
              } else {
                onToggleEditMode();
              }
            }}
            className={`min-h-[46px] min-w-[46px] p-2 rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0 border ${
              isCuratorLoggedIn && isEditModeActive
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-xs'
                : 'bg-stone-800 text-stone-300 border-white/10 hover:text-white'
            }`}
            title={
              isCuratorLoggedIn
                ? isEditModeActive
                  ? 'Live-Edit aktiv (Tippen zum Deaktivieren)'
                  : 'Live-Edit inaktiv'
                : 'Studio-Login (Passwort: 164325)'
            }
          >
            {isCuratorLoggedIn ? (
              <Edit3 className="w-4 h-4" />
            ) : (
              <Lock className="w-4 h-4 text-stone-400" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Touch Color-Theme Bottom Sheet */}
      {isThemeSheetOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Farbpalette auswählen"
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-3"
          onClick={() => setIsThemeSheetOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#18191f] border border-white/15 rounded-3xl p-6 text-white shadow-2xl space-y-4 mb-2 animate-in slide-in-from-bottom duration-200"
          >
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto -mt-1 mb-2" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gold-light" />
                <h3 className="font-serif text-lg font-light tracking-wide text-white">
                  Farbpalette &amp; Theme wählen
                </h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">Gespeichert im LocalStorage</span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto py-1">
              {THEME_PRESETS.map((preset) => {
                const isSelected = currentTheme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectThemePreset(preset);
                      applyThemeToDocument(preset);
                      setIsThemeSheetOpen(false);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 min-h-[70px] ${
                      isSelected
                        ? 'border-amber-400 bg-white/15 ring-2 ring-amber-400/50'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-xs inline-block"
                          style={{ backgroundColor: preset.bgCanvas }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-white/20 shadow-xs inline-block"
                          style={{ backgroundColor: preset.accentColor }}
                        />
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-300" />}
                    </div>

                    <div className="text-xs font-serif leading-tight">
                      {preset.name}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Theme Editor Button */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setIsThemeSheetOpen(false);
                  onOpenThemeEditor();
                }}
                className="w-full py-2.5 text-center bg-white/10 hover:bg-white/15 rounded-xl border border-white/15 text-neutral-200 font-mono text-[11px] cursor-pointer"
              >
                Erweiterte Hex-Farben bearbeiten
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
