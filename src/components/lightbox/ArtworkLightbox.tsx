import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  LayoutTemplate,
  Info,
  Sparkles,
  Award,
} from 'lucide-react';
import { Artwork } from '../../types';

interface ArtworkLightboxProps {
  artwork: Artwork;
  artworks: Artwork[];
  isOpen: boolean;
  initialWallMode?: boolean;
  onClose: () => void;
  onSelectArtwork: (artwork: Artwork) => void;
  onInquire: (artwork: Artwork) => void;
}

export const ArtworkLightbox: React.FC<ArtworkLightboxProps> = ({
  artwork,
  artworks,
  isOpen,
  initialWallMode = false,
  onClose,
  onSelectArtwork,
  onInquire,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'detail' | 'wall'>(
    initialWallMode ? 'wall' : 'detail'
  );
  const [activeWallEnv, setActiveWallEnv] = useState<'concrete' | 'penthouse' | 'gallery'>('concrete');
  const [activeFrame, setActiveFrame] = useState<'black_oak' | 'natural_wood' | 'floating_metal'>('black_oak');
  const [showCuratorialPanel, setShowCuratorialPanel] = useState<boolean>(true);

  // Sync mode if initialWallMode changes
  useEffect(() => {
    if (initialWallMode) {
      setViewMode('wall');
    }
  }, [initialWallMode, artwork.id]);

  // Reset zoom on artwork change
  useEffect(() => {
    setZoomLevel(1);
  }, [artwork.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        navigatePrev();
      } else if (e.key === 'ArrowRight') {
        navigateNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, artwork.id, artworks]);

  if (!isOpen) return null;

  const currentIndex = artworks.findIndex((a) => a.id === artwork.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < artworks.length - 1;

  const navigatePrev = () => {
    if (hasPrev) {
      onSelectArtwork(artworks[currentIndex - 1]);
    }
  };

  const navigateNext = () => {
    if (hasNext) {
      onSelectArtwork(artworks[currentIndex + 1]);
    }
  };

  // Wall environment styling
  const wallBackgroundStyles = {
    concrete: 'bg-neutral-900 border-neutral-800',
    penthouse: 'bg-[#0f1115] border-neutral-900',
    gallery: 'bg-neutral-800 border-neutral-700',
  };

  // Frame styles
  const frameBorderStyles = {
    black_oak: 'p-3 bg-[#0a0a0c] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border-4 border-[#18181b]',
    natural_wood: 'p-3 bg-[#241a13] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] border-4 border-[#453123]',
    floating_metal: 'p-2 bg-transparent shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)] border border-white/20',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Exhibition View: ${artwork.title}`}
      className="fixed inset-0 z-50 bg-[#060708]/95 backdrop-blur-xl flex flex-col overflow-hidden text-neutral-200"
    >
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#090a0d]/80 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
            Exhibition Plate {currentIndex + 1} / {artworks.length}
          </span>
          <span aria-hidden="true" className="text-neutral-600">·</span>
          <span className="hidden sm:inline font-serif text-sm tracking-wide text-white">
            {artwork.title}
          </span>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.05] border border-white/[0.08] rounded-sm">
          <button
            onClick={() => setViewMode('detail')}
            className={`px-3 py-1 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer ${
              viewMode === 'detail'
                ? 'bg-white text-black font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Artwork Detail
          </button>
          <button
            onClick={() => setViewMode('wall')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs tracking-wider uppercase transition-colors rounded-sm cursor-pointer ${
              viewMode === 'wall'
                ? 'bg-white text-black font-medium'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutTemplate className="w-3 h-3" />
            <span>Wall Preview</span>
          </button>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCuratorialPanel(!showCuratorialPanel)}
            className={`p-2 border border-white/[0.08] rounded-sm text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer ${
              showCuratorialPanel ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Toggle Curatorial Sheet"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Curatorial Sheet</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close Lightbox"
            className="p-2 text-neutral-400 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-sm transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Exhibition Viewport Area */}
      <div className="relative flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Artwork Canvas Container */}
        <div className="relative flex-1 flex items-center justify-center p-4 lg:p-10 overflow-hidden bg-neutral-950">
          {viewMode === 'detail' ? (
            /* Mode A: Clean Detail Inspector */
            <div className="relative w-full h-full flex items-center justify-center">
              <div
                className="relative max-h-full max-w-full flex items-center justify-center transition-transform duration-300"
                style={{
                  transform: `scale(${zoomLevel})`,
                  cursor: zoomLevel > 1 ? 'zoom-out' : 'zoom-in',
                }}
                onClick={() => setZoomLevel(zoomLevel === 1 ? 1.8 : 1)}
              >
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] max-w-[90vw] object-contain shadow-2xl border border-white/15 rounded-2xl sm:rounded-3xl select-none"
                />
              </div>

              {/* Floating Zoom Controls */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-[#0d0f12]/80 backdrop-blur-md border border-white/10 p-1 rounded-sm text-neutral-400">
                <button
                  onClick={() => setZoomLevel(1)}
                  disabled={zoomLevel === 1}
                  className="p-1.5 hover:text-white disabled:opacity-40 cursor-pointer"
                  title="Reset Zoom (1x)"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono px-1 text-neutral-300 tabular-nums">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(zoomLevel === 1 ? 1.8 : 1)}
                  className="p-1.5 hover:text-white cursor-pointer"
                  title="Inspect Texture (1.8x)"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Mode B: Interactive Wall Simulation */
            <div
              className={`relative w-full h-full flex flex-col items-center justify-center border transition-colors duration-500 overflow-hidden p-6 ${wallBackgroundStyles[activeWallEnv]}`}
            >
              {/* Gallery Ceiling Track Spotlights */}
              <div className="absolute top-0 inset-x-0 h-10 border-b border-white/[0.04] flex justify-around opacity-30">
                <div className="w-4 h-2 bg-neutral-500 rounded-b" />
                <div className="w-4 h-2 bg-neutral-500 rounded-b" />
                <div className="w-4 h-2 bg-neutral-500 rounded-b" />
              </div>

              {/* Artwork Hung on Simulated Wall with Frame */}
              <div className="relative z-10 flex flex-col items-center max-h-[60vh] max-w-[70vw]">
                <div className={`${frameBorderStyles[activeFrame]} rounded-2xl overflow-hidden transition-all duration-300`}>
                  <img
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[50vh] max-w-[65vw] object-contain block rounded-lg"
                  />
                </div>
                {/* Museum wall plaque */}
                <div className="mt-3 px-3 py-1 bg-neutral-950/80 border border-white/10 text-[10px] text-neutral-400 font-mono tracking-widest text-center">
                  {artwork.title} · {artwork.dimensions}
                </div>
              </div>

              {/* Minimalist modern gallery bench for scale reference */}
              <div className="relative mt-8 w-64 h-7 bg-neutral-800/80 border-t border-neutral-700/60 shadow-2xl flex items-center justify-center">
                <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono">
                  180 cm Gallery Bench
                </span>
                {/* Bench legs */}
                <div className="absolute -bottom-3 left-4 w-1.5 h-3 bg-neutral-700" />
                <div className="absolute -bottom-3 right-4 w-1.5 h-3 bg-neutral-700" />
              </div>

              {/* Wall Environment Controls Bar */}
              <div className="absolute bottom-6 flex flex-wrap items-center justify-center gap-4 bg-black/75 backdrop-blur-md border border-white/10 px-4 py-2 rounded-sm text-xs">
                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-[11px] uppercase tracking-wider">Wall:</span>
                  <button
                    onClick={() => setActiveWallEnv('concrete')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      activeWallEnv === 'concrete' ? 'bg-white/20 text-white font-medium' : 'hover:text-white'
                    }`}
                  >
                    Raw Concrete
                  </button>
                  <button
                    onClick={() => setActiveWallEnv('penthouse')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      activeWallEnv === 'penthouse' ? 'bg-white/20 text-white font-medium' : 'hover:text-white'
                    }`}
                  >
                    Dark Salon
                  </button>
                  <button
                    onClick={() => setActiveWallEnv('gallery')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      activeWallEnv === 'gallery' ? 'bg-white/20 text-white font-medium' : 'hover:text-white'
                    }`}
                  >
                    Museum Stone
                  </button>
                </div>

                <div className="h-3 w-px bg-white/20" />

                <div className="flex items-center gap-2 text-neutral-400">
                  <span className="text-[11px] uppercase tracking-wider">Frame:</span>
                  <button
                    onClick={() => setActiveFrame('black_oak')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      activeFrame === 'black_oak' ? 'bg-white/20 text-white font-medium' : 'hover:text-white'
                    }`}
                  >
                    Black Oak
                  </button>
                  <button
                    onClick={() => setActiveFrame('natural_wood')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      activeFrame === 'natural_wood' ? 'bg-white/20 text-white font-medium' : 'hover:text-white'
                    }`}
                  >
                    Walnut
                  </button>
                  <button
                    onClick={() => setActiveFrame('floating_metal')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      activeFrame === 'floating_metal' ? 'bg-white/20 text-white font-medium' : 'hover:text-white'
                    }`}
                  >
                    Floating Tray
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Previous / Next Arrow Overlays */}
          {hasPrev && (
            <button
              onClick={navigatePrev}
              aria-label="Previous Artwork"
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 text-neutral-400 hover:text-white border border-white/10 rounded-sm transition-all cursor-pointer z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {hasNext && (
            <button
              onClick={navigateNext}
              aria-label="Next Artwork"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/90 text-neutral-400 hover:text-white border border-white/10 rounded-sm transition-all cursor-pointer z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Curatorial Accession Sheet (Collapsible side drawer or panel) */}
        {showCuratorialPanel && (
          <aside className="w-full lg:w-96 bg-[#0a0c0f] border-t lg:border-t-0 lg:border-l border-white/[0.08] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto shrink-0 max-h-[45vh] lg:max-h-full">
            <div>
              {/* Header */}
              <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-neutral-400 mb-2">
                <span>{artwork.series}</span>
                <span aria-hidden="true">·</span>
                <span>{artwork.year}</span>
              </div>

              <h2 className="font-serif text-3xl font-light text-white tracking-wide mb-3">
                {artwork.title}
              </h2>

              <p className="text-xs text-neutral-300 leading-relaxed font-light mb-6">
                {artwork.description}
              </p>

              {/* Definition List (Curatorial Pattern B from guidelines) */}
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 block mb-1">
                    Medium & Substrate
                  </span>
                  <p className="text-xs text-neutral-200 font-light">
                    {artwork.medium}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 block mb-1">
                    Physical Dimensions
                  </span>
                  <p className="text-xs text-neutral-200 font-mono">
                    {artwork.dimensions}
                  </p>
                </div>

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 block mb-1">
                    Edition & Availability
                  </span>
                  <p className="text-xs text-neutral-200 font-mono">
                    {artwork.edition} · {artwork.availableEditions} remaining
                  </p>
                </div>

                {/* Technical / Camera / Algorithm Details */}
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 block mb-1">
                    Process & Apparatus
                  </span>
                  <p className="text-xs text-neutral-300 font-mono">
                    {artwork.technicalDetails.cameraOrEngine}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {artwork.technicalDetails.lensOrAlgorithm} ({artwork.technicalDetails.fileSpec})
                  </p>
                </div>

                {/* Exhibitions */}
                {artwork.exhibitions && artwork.exhibitions.length > 0 && (
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500 block mb-1">
                      Exhibition Provenance
                    </span>
                    <ul className="text-xs text-neutral-300 space-y-1">
                      {artwork.exhibitions.map((ex, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Award className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Inquire / Acquire CTA */}
            <div className="pt-6 mt-6 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-mono">
                  Valuation
                </span>
                <span className="font-mono text-2xl font-medium text-gold-light tabular-nums font-semibold">
                  €{artwork.price.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => onInquire(artwork)}
                className="w-full py-3 text-xs uppercase tracking-[0.2em] font-medium bg-white text-black hover:bg-neutral-200 transition-colors rounded-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-neutral-700" />
                <span>Request Acquisition Dossier</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
