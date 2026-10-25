import React from 'react';
import { ShoppingBag, Lock, Unlock, Palette, Plus } from 'lucide-react';
import { LionFaceLogo } from '../common/LionFaceLogo';

interface TopBarProps {
  activeTab: 'home' | 'gallery' | 'shop' | 'about' | 'contact' | 'admin';
  onNavigate: (tab: 'home' | 'gallery' | 'shop' | 'about' | 'contact' | 'admin') => void;
  cartCount: number;
  onOpenCart: () => void;
  isCuratorLoggedIn?: boolean;
  onOpenCuratorAuth?: () => void;
  onOpenThemeEditor?: () => void;
  onOpenUploadArt?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onNavigate,
  cartCount,
  onOpenCart,
  isCuratorLoggedIn,
  onOpenCuratorAuth,
  onOpenThemeEditor,
  onOpenUploadArt,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/95 backdrop-blur-md border-b border-[#e7e5e0] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 lg:px-12 py-3.5">
        {/* Zone 1: Royal lion face crest & artist name in rich gold */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left group cursor-pointer focus:outline-none flex items-center gap-3"
        >
          <div className="p-1 rounded-full bg-[#f4ede1] border border-[#d4af37]/40 shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <LionFaceLogo size={22} color="#b8860b" />
          </div>
          <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.2em] uppercase text-gold group-hover:text-gold-light transition-colors whitespace-nowrap shrink-0">
            Navid Ali Bhatti
          </span>
        </button>

        {/* Zone 2: 4–5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.2em] font-medium text-stone-600">
          <button
            onClick={() => onNavigate('home')}
            className={`transition-colors hover:text-black pb-1 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'home' ? 'text-black border-b border-black font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('gallery')}
            className={`transition-colors hover:text-black pb-1 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'gallery' ? 'text-black border-b border-black font-semibold' : ''
            }`}
          >
            Gallery
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className={`transition-colors hover:text-black pb-1 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'shop' ? 'text-black border-b border-black font-semibold' : ''
            }`}
          >
            Editions & Shop
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors hover:text-black pb-1 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'about' ? 'text-black border-b border-black font-semibold' : ''
            }`}
          >
            Monographs & Bio
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className={`transition-colors hover:text-black pb-1 whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'contact' ? 'text-black border-b border-black font-semibold' : ''
            }`}
          >
            Studio Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label="Collector Portfolio Cart"
            className="flex items-center gap-2.5 px-3.5 py-1.5 text-xs tracking-wider uppercase bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-sm text-stone-900 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
            {cartCount > 0 && (
              <span className="font-mono text-[11px] tabular-nums text-stone-900 font-semibold">
                ({cartCount})
              </span>
            )}
          </button>

          {/* Quick theme trigger if curator */}
          {isCuratorLoggedIn && onOpenThemeEditor && (
            <button
              onClick={onOpenThemeEditor}
              title="Live Edit Website Themes & Colors"
              className="p-1.5 text-stone-600 hover:text-stone-900 border border-stone-300 hover:border-stone-500 rounded-sm transition-colors cursor-pointer bg-white"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
            </button>
          )}

          {/* Quick upload trigger if curator */}
          {isCuratorLoggedIn && onOpenUploadArt && (
            <button
              onClick={onOpenUploadArt}
              title="Upload New Artwork"
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Art</span>
            </button>
          )}

          {/* Curator CMS Auth Lock / Unlock */}
          <button
            onClick={() => {
              if (isCuratorLoggedIn) {
                onNavigate('admin');
              } else if (onOpenCuratorAuth) {
                onOpenCuratorAuth();
              } else {
                onNavigate('admin');
              }
            }}
            title={isCuratorLoggedIn ? 'Curator Mode Active (Studio CMS)' : 'Unlock Curator CMS (Password: 164325)'}
            className={`relative p-1.5 transition-colors cursor-pointer rounded-sm border ${
              isCuratorLoggedIn
                ? 'text-emerald-700 bg-emerald-50 border-emerald-300 hover:bg-emerald-100'
                : 'text-stone-500 hover:text-black border-transparent hover:border-stone-300'
            }`}
          >
            {isCuratorLoggedIn ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </>
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center justify-around px-4 py-2 border-t border-[#e7e5e0] text-[10px] uppercase tracking-wider text-stone-600 bg-[#f7f5f0]">
        <button
          onClick={() => onNavigate('home')}
          className={`py-1 ${activeTab === 'home' ? 'text-black font-semibold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('gallery')}
          className={`py-1 ${activeTab === 'gallery' ? 'text-black font-semibold' : ''}`}
        >
          Gallery
        </button>
        <button
          onClick={() => onNavigate('shop')}
          className={`py-1 ${activeTab === 'shop' ? 'text-black font-semibold' : ''}`}
        >
          Editions
        </button>
        <button
          onClick={() => onNavigate('about')}
          className={`py-1 ${activeTab === 'about' ? 'text-black font-semibold' : ''}`}
        >
          Bio
        </button>
        <button
          onClick={() => onNavigate('contact')}
          className={`py-1 ${activeTab === 'contact' ? 'text-black font-semibold' : ''}`}
        >
          Contact
        </button>
      </div>
    </header>
  );
};
