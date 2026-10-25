import React, { useState } from 'react';
import {
  Palette,
  Plus,
  Edit3,
  Sliders,
  LogOut,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Shield,
  User,
} from 'lucide-react';
import { GalleryTheme } from '../../types';

interface CuratorLiveBarProps {
  currentTheme: GalleryTheme;
  isEditModeActive: boolean;
  onToggleEditMode: () => void;
  onOpenUploadArt: () => void;
  onOpenThemeEditor: () => void;
  onOpenProfileEditor: () => void;
  onOpenFullCMS: () => void;
  onLogout: () => void;
}

export const CuratorLiveBar: React.FC<CuratorLiveBarProps> = ({
  currentTheme,
  isEditModeActive,
  onToggleEditMode,
  onOpenUploadArt,
  onOpenThemeEditor,
  onOpenProfileEditor,
  onOpenFullCMS,
  onLogout,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw] transition-all duration-300">
      <div
        className="backdrop-blur-md border shadow-2xl rounded-sm p-1.5 sm:p-2 flex items-center gap-2 text-xs transition-colors"
        style={{
          backgroundColor: currentTheme.isDark ? 'rgba(18, 20, 24, 0.92)' : 'rgba(255, 255, 255, 0.94)',
          borderColor: currentTheme.borderColor,
          color: currentTheme.textPrimary,
        }}
      >
        {/* Curator Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider border-r shrink-0" style={{ borderColor: currentTheme.borderColor }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold hidden sm:inline">Curator Mode</span>
          <span className="text-[10px] opacity-60 hidden md:inline">· 164325</span>
        </div>

        {/* Core Actions */}
        {!isCollapsed && (
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            {/* Upload New Art */}
            <button
              onClick={onOpenUploadArt}
              className="px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-sm cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap shadow-xs"
              style={{
                backgroundColor: currentTheme.accentColor,
                color: currentTheme.accentContrast,
              }}
              title="Upload new fine art or digital plate"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload Art</span>
            </button>

            {/* Themes & Colours */}
            <button
              onClick={onOpenThemeEditor}
              className="px-2.5 py-1.5 border rounded-sm cursor-pointer transition-all hover:bg-black/5 flex items-center gap-1.5 whitespace-nowrap"
              style={{
                borderColor: currentTheme.borderColor,
                color: currentTheme.textPrimary,
              }}
              title="Live edit website themes & colors"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Theme &amp; Colours</span>
              <span className="sm:hidden">Theme</span>
            </button>

            {/* In-Place Edit Mode Toggle */}
            <button
              onClick={onToggleEditMode}
              className={`px-2.5 py-1.5 border rounded-sm cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isEditModeActive
                  ? 'bg-amber-500/10 border-amber-500 font-semibold text-amber-900'
                  : 'hover:bg-black/5'
              }`}
              style={{
                borderColor: isEditModeActive ? undefined : currentTheme.borderColor,
              }}
              title="Toggle in-place edit buttons on artworks"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Quick Edit:</span>
              <span>{isEditModeActive ? 'ON' : 'OFF'}</span>
            </button>

            {/* Profile & Monograph */}
            <button
              onClick={onOpenProfileEditor}
              className="px-2.5 py-1.5 border rounded-sm cursor-pointer transition-all hover:bg-black/5 flex items-center gap-1.5 whitespace-nowrap hidden lg:flex"
              style={{
                borderColor: currentTheme.borderColor,
                color: currentTheme.textPrimary,
              }}
              title="Edit artist statement & monograph"
            >
              <User className="w-3.5 h-3.5" />
              <span>Bio &amp; Info</span>
            </button>

            {/* Full CMS Desk */}
            <button
              onClick={onOpenFullCMS}
              className="px-2.5 py-1.5 border rounded-sm cursor-pointer transition-all hover:bg-black/5 flex items-center gap-1.5 whitespace-nowrap hidden md:flex"
              style={{
                borderColor: currentTheme.borderColor,
                color: currentTheme.textPrimary,
              }}
              title="Open full administrative dashboard"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Full CMS</span>
            </button>
          </div>
        )}

        {/* Collapse toggle and Logout */}
        <div className="flex items-center gap-1 pl-1 border-l" style={{ borderColor: currentTheme.borderColor }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-sm hover:bg-black/5 transition-colors cursor-pointer text-stone-500"
            title={isCollapsed ? 'Expand bar' : 'Minimize bar'}
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onLogout}
            className="p-1.5 rounded-sm hover:bg-rose-50 text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="Lock and logout"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
