import React, { useState, useMemo } from 'react';
import {
  Grid,
  Columns,
  Search,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { Artwork, ArtworkCategory } from '../../types';
import { ArtworkCard } from './ArtworkCard';
import { LionFaceLogo } from '../common/LionFaceLogo';

interface GalleryCatalogProps {
  artworks: Artwork[];
  onOpenArtwork: (artwork: Artwork) => void;
  onOpenWallView: (artwork: Artwork) => void;
  onInquire: (artwork: Artwork) => void;
  isCuratorMode?: boolean;
  onQuickEdit?: (artwork: Artwork) => void;
}

export const GalleryCatalog: React.FC<GalleryCatalogProps> = ({
  artworks,
  onOpenArtwork,
  onOpenWallView,
  onInquire,
  isCuratorMode,
  onQuickEdit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ArtworkCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'curated' | 'year-desc' | 'year-asc' | 'price-desc'>('curated');
  const [viewLayout, setViewLayout] = useState<'masonry' | 'grid'>('masonry');

  const categories: { key: ArtworkCategory | 'all'; label: string }[] = [
    { key: 'all', label: 'All Works' },
    { key: 'monochrome', label: 'Monochrome Photography' },
    { key: 'generative', label: 'Algorithmic & Generative' },
    { key: 'architectural', label: 'Brutalist Architecture' },
    { key: 'conceptual', label: 'Conceptual Voids' },
  ];

  // Filtering & Sorting
  const filteredArtworks = useMemo(() => {
    let result = [...artworks];

    if (selectedCategory !== 'all') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.series.toLowerCase().includes(q) ||
          a.medium.toLowerCase().includes(q) ||
          a.curatorialNotes.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'curated':
      default:
        result.sort((a, b) => a.sortOrder - b.sortOrder);
        break;
    }

    return result;
  }, [artworks, selectedCategory, searchQuery, sortBy]);

  return (
    <section className="py-12 lg:py-20 border-b border-[#e7e5e0] bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Gallery Title & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.25em] text-stone-500 font-mono mb-2">
              <LionFaceLogo size={16} color="#b8860b" />
              <span>Catalog Raisonné</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span><strong className="text-gold font-medium">Navid Ali Bhatti</strong> Oeuvre</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight">
              Selected Works &amp; Plates
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
            <span>
              Showing <strong className="text-gold font-semibold">{filteredArtworks.length}</strong> of{' '}
              {artworks.length} artworks
            </span>
          </div>
        </div>

        {/* Interactive Filter & Utility Toolbar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 p-4 bg-white border border-[#e5e3dc] shadow-sm rounded-2xl mb-10">
          {/* Category Tabs (Segmented functional buttons) */}
          <div className="flex flex-wrap items-center gap-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.key
                    ? 'bg-stone-900 text-white font-medium shadow-xs'
                    : 'text-stone-600 hover:text-black hover:bg-stone-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search, Sort & Layout Switch */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search series, medium..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#faf9f6] border border-stone-300 rounded-sm text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#faf9f6] border border-stone-300 rounded-sm px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none cursor-pointer"
              >
                <option value="curated">Curatorial Sequence</option>
                <option value="year-desc">Year (Newest)</option>
                <option value="year-asc">Year (Oldest)</option>
                <option value="price-desc">Acquisition Value (High-Low)</option>
              </select>
            </div>

            {/* Layout Toggle (Grid vs Masonry) */}
            <div className="flex items-center gap-1 border-l border-stone-200 pl-3">
              <button
                onClick={() => setViewLayout('masonry')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewLayout === 'masonry' ? 'bg-stone-200 text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-800'
                }`}
                title="Fluid Masonry Layout"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  viewLayout === 'grid' ? 'bg-stone-200 text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-800'
                }`}
                title="Structured Uniform Grid"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Artworks List / Grid */}
        {filteredArtworks.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-stone-300 rounded-sm bg-white">
            <Filter className="w-6 h-6 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-xl text-stone-900 mb-2">No artworks matched your criteria</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto mb-6">
              Try adjusting your category filter or search keywords to view other photographic and generative works.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs uppercase tracking-wider bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-sm cursor-pointer shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : viewLayout === 'masonry' ? (
          /* Fluid Masonry Grid (Bento style dynamic rhythm) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((art, idx) => {
              // Highlight first or third card in 2-column span for editorial rhythm if wanted
              const isLarge = idx === 0 || idx === 3;
              return (
                <div
                  key={art.id}
                  className={isLarge ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}
                >
                  <ArtworkCard
                    artwork={art}
                    onOpen={onOpenArtwork}
                    onOpenWallView={onOpenWallView}
                    onInquire={onInquire}
                    isCuratorMode={isCuratorMode}
                    onQuickEdit={onQuickEdit}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* Structured Uniform Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtworks.map((art) => (
              <ArtworkCard
                key={art.id}
                artwork={art}
                onOpen={onOpenArtwork}
                onOpenWallView={onOpenWallView}
                onInquire={onInquire}
                isCuratorMode={isCuratorMode}
                onQuickEdit={onQuickEdit}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
