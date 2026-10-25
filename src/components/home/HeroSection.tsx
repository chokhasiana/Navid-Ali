import React from 'react';
import { ArrowRight, Eye, Maximize2 } from 'lucide-react';
import { Artwork } from '../../types';
import { LionFaceLogo } from '../common/LionFaceLogo';

interface HeroSectionProps {
  featuredArtwork: Artwork;
  onExploreGallery: () => void;
  onInquire: () => void;
  onOpenArtwork: (artwork: Artwork) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredArtwork,
  onExploreGallery,
  onInquire,
  onOpenArtwork,
}) => {
  return (
    <section className="relative pt-6 pb-16 lg:py-20 border-b border-[#e7e5e0] bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Split Screen Hero: Left Typography, Right Grand Artwork Visual Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Clean editorial kicker with tiny golden lion face */}
            <div className="flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase text-stone-500 mb-6 font-mono">
              <LionFaceLogo size={16} color="#b8860b" />
              <span className="text-gold font-medium">Navid Ali Bhatti</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>2024 – 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-stone-900 leading-[1.08] mb-6 text-balance">
              The Architecture of Silence &amp; Light
            </h1>

            {/* Curatorial statement with gold artist name */}
            <p className="text-base text-stone-600 leading-relaxed font-light mb-8 max-w-xl">
              Photographic investigations into monumental brutalism, transient coastal atmospheres, and algorithmic light fields by <span className="text-gold font-medium">Navid Ali Bhatti</span>. Produced as museum-grade carbon pigment prints on archival rag and floating aluminium substrates.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreGallery}
                className="px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors rounded-sm cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2.5 shadow-sm"
              >
                <span>Explore Works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onInquire}
                className="px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium bg-transparent text-stone-800 hover:text-black border border-stone-300 hover:border-stone-500 transition-colors rounded-sm cursor-pointer whitespace-nowrap shrink-0"
              >
                Acquisition Inquiries
              </button>
            </div>
          </div>

          {/* Right Column (7 Cols): Curved Standout Artwork Container */}
          <div className="lg:col-span-7">
            <div
              onClick={() => onOpenArtwork(featuredArtwork)}
              className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-[#c59b27]/30 bg-white shadow-2xl transition-all duration-300 hover:border-[#c59b27]/70 hover:shadow-[0_25px_60px_-15px_rgba(197,155,39,0.2)]"
            >
              {/* Aspect ratio frame with curved corners */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-stone-950">
                <img
                  src={featuredArtwork.imageUrl}
                  alt={featuredArtwork.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />

                {/* Scrim overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Floating view action icon */}
                <div className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-white/80 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Artwork caption overlaid at bottom with gold price */}
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#d4af37] font-mono block mb-1">
                      Featured Plate · {featuredArtwork.series}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-wide text-white">
                      {featuredArtwork.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-200 mt-1.5 font-light">
                      <span>{featuredArtwork.medium}</span>
                      <span aria-hidden="true">·</span>
                      <span>{featuredArtwork.dimensions}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-start sm:items-end gap-1 shrink-0">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-300">Edition Valuation</span>
                    <span className="font-mono text-xl sm:text-2xl font-medium text-gold-light tabular-nums">
                      €{featuredArtwork.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-neutral-200 group-hover:text-white transition-colors mt-0.5">
                      <Eye className="w-3 h-3 text-gold-light" />
                      <span>Inspect</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width curatorial proof strip below the split */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-12 border-t border-[#e7e5e0]">
          <div>
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-1 font-medium">
              Monograph
            </span>
            <p className="text-sm font-medium text-stone-900">
              The Geometry of Silence
            </p>
            <span className="text-xs text-stone-500">
              Hatje Cantz Berlin (2024)
            </span>
          </div>

          <div>
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-1 font-medium">
              Print Process
            </span>
            <p className="text-sm font-medium text-stone-900">
              Archival Carbon Pigment
            </p>
            <span className="text-xs text-stone-500">
              Hahnemühle Photo Rag 308g
            </span>
          </div>

          <div>
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-1 font-medium">
              Recent Exhibition
            </span>
            <p className="text-sm font-medium text-stone-900">
              Neue Nationalgalerie
            </p>
            <span className="text-xs text-stone-500">
              Berlin Solo Retrospective
            </span>
          </div>

          <div>
            <span className="font-mono text-xs text-gold uppercase tracking-widest block mb-1 font-medium">
              Collector Status
            </span>
            <p className="text-sm font-medium text-stone-900">
              Limited Editions
            </p>
            <span className="text-xs text-stone-500">
              Numbered &amp; Signed with COA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
