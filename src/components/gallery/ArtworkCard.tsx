import React from 'react';
import { Eye, LayoutTemplate, Sparkles, Edit2 } from 'lucide-react';
import { Artwork } from '../../types';

interface ArtworkCardProps {
  artwork: Artwork;
  onOpen: (artwork: Artwork) => void;
  onOpenWallView: (artwork: Artwork) => void;
  onInquire: (artwork: Artwork) => void;
  isCuratorMode?: boolean;
  onQuickEdit?: (artwork: Artwork) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onOpen,
  onOpenWallView,
  onInquire,
  isCuratorMode,
  onQuickEdit,
}) => {
  // Determine aspect ratio class
  const aspectClass =
    artwork.aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : artwork.aspectRatio === '3:4'
      ? 'aspect-[3/4]'
      : artwork.aspectRatio === '1:1'
      ? 'aspect-[1/1]'
      : 'aspect-[4/3]';

  return (
    <article className="group flex flex-col bg-white border border-[#e5e3dc] hover:border-[#c59b27]/60 hover:shadow-[0_20px_45px_-15px_rgba(197,155,39,0.18)] transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden">
      {/* Visual Frame - Curved Picture Container */}
      <div className="p-2 sm:p-3 pb-0">
        <div
          onClick={() => onOpen(artwork)}
          className={`relative w-full ${aspectClass} overflow-hidden rounded-xl sm:rounded-2xl bg-stone-950 cursor-pointer shadow-xs`}
        >
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            onError={(e) => {
              // Resilient fallback
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Hover Quick Actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5 p-4 flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen(artwork);
              }}
              className="px-3.5 py-2 text-xs uppercase tracking-wider font-medium bg-white text-stone-900 hover:bg-stone-100 rounded-sm shadow-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Examine</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenWallView(artwork);
              }}
              title="Simulate on Gallery Wall"
              className="p-2 text-xs uppercase tracking-wider font-medium bg-black/80 hover:bg-black text-white border border-white/20 hover:border-white/40 rounded-sm shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wall View</span>
            </button>

            {isCuratorMode && onQuickEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickEdit(artwork);
                }}
                title="Live Edit Artwork Details"
                className="px-3 py-2 text-xs uppercase tracking-wider font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-sm shadow-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Featured indicator if featured */}
          {artwork.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-stone-900/85 backdrop-blur-md border border-[#c59b27]/30 text-[10px] tracking-widest uppercase text-gold-light font-mono rounded-full">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              <span>Featured Plate</span>
            </div>
          )}

          {/* Curator Quick Edit Pill when in Curator Mode */}
          {isCuratorMode && onQuickEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickEdit(artwork);
              }}
              title="Quick edit this artwork"
              className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 text-[11px] font-mono font-bold tracking-wider uppercase rounded-sm shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Metadata Section - Zero Pill Discipline */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-4 bg-white">
        <div>
          {/* Unboxed inline metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono tracking-wider uppercase mb-2">
            <span>{artwork.series}</span>
            <span aria-hidden="true">·</span>
            <span>{artwork.year}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400">{artwork.category}</span>
          </div>

          <h3
            onClick={() => onOpen(artwork)}
            className="font-serif text-xl sm:text-2xl font-light text-stone-900 group-hover:text-gold transition-colors cursor-pointer"
          >
            {artwork.title}
          </h3>

          <p className="text-xs text-stone-600 font-light mt-1.5 line-clamp-2">
            {artwork.medium}
          </p>
        </div>

        {/* Bottom Specs & Action Bar with Gold Price */}
        <div className="pt-3 border-t border-[#f0eee9] flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2 font-mono">
            <span>{artwork.dimensions}</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-400">{artwork.edition}</span>
          </div>

          <button
            onClick={() => onInquire(artwork)}
            className="text-xs uppercase tracking-wider text-stone-900 hover:text-black transition-colors cursor-pointer font-medium flex items-center gap-1.5"
          >
            <span>Inquire</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="text-gold font-semibold font-mono text-xs">€{artwork.price.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
