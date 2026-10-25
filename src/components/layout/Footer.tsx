import React from 'react';
import { LionFaceLogo } from '../common/LionFaceLogo';

interface FooterProps {
  onNavigate: (tab: 'home' | 'gallery' | 'shop' | 'about' | 'contact' | 'admin') => void;
  onOpenLegal: (type: 'impressum' | 'datenschutz') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLegal }) => {
  return (
    <footer className="bg-[#f4f2ee] border-t border-[#e2dfd7] text-stone-600 py-16 px-6 lg:px-12 text-xs relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#e5e3dc]">
        {/* Col 1: Wordmark & Royal Lion Crest */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-[#f4ede1] border border-[#d4af37]/40 shadow-xs">
              <LionFaceLogo size={24} color="#b8860b" />
            </div>
            <span className="font-serif text-2xl tracking-[0.2em] uppercase text-gold font-light">
              Navid Ali Bhatti
            </span>
          </div>
          <p className="text-stone-600 font-light text-xs leading-relaxed max-w-sm pt-1">
            Contemporary Fine Art Photography &amp; Algorithmic Spatial Media. Archival carbon pigment editions and generative light manifolds exploring architectural voids and transient atmospheres.
          </p>
          <div className="text-[11px] font-mono text-stone-500 pt-1">
            Berlin Studio · Zürich · Lahore Field Office
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div className="md:col-span-3 space-y-3">
          <span className="font-mono uppercase tracking-widest text-stone-900 text-[11px] block font-semibold">
            Navigation
          </span>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => onNavigate('home')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('gallery')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Gallery Catalog
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('shop')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Limited Editions &amp; Shop
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('about')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Monographs &amp; Biography
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('contact')}
                className="hover:text-black transition-colors cursor-pointer"
              >
                Studio Inquiries
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Institutional & Press Representation */}
        <div className="md:col-span-4 space-y-3">
          <span className="font-mono uppercase tracking-widest text-stone-900 text-[11px] block font-semibold">
            Representation &amp; Press
          </span>
          <p className="text-stone-800">Galerie Nordenfalk (Berlin / Stockholm)</p>
          <p className="text-stone-600">Hatje Cantz Verlag (Monograph Distribution)</p>
          <div className="pt-2 flex items-center gap-4 text-xs font-mono">
            <a
              href="#instagram"
              onClick={(e) => {
                e.preventDefault();
                alert('Artist Instagram channel: @navid.ali.bhatti.studio');
              }}
              className="text-stone-600 hover:text-black transition-colors"
            >
              Instagram
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="#artsy"
              onClick={(e) => {
                e.preventDefault();
                alert('Artsy Gallery profile: artsy.net/artist/navid-ali-bhatti');
              }}
              className="text-stone-600 hover:text-black transition-colors"
            >
              Artsy
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="#monograph"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('about');
              }}
              className="text-stone-600 hover:text-black transition-colors"
            >
              Hatje Cantz
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
        <div>
          © {new Date().getFullYear()} Studio <span className="text-gold font-medium">Navid Ali Bhatti</span>. All works protected under international copyright.
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenLegal('impressum')}
            className="hover:text-black transition-colors cursor-pointer underline underline-offset-4"
          >
            Impressum
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => onOpenLegal('datenschutz')}
            className="hover:text-black transition-colors cursor-pointer underline underline-offset-4"
          >
            Datenschutz
          </button>
          <span aria-hidden="true">·</span>
          <button
            onClick={() => onNavigate('admin')}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Studio CMS
          </button>
        </div>
      </div>
    </footer>
  );
};
