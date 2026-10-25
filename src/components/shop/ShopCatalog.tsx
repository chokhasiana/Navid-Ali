import React, { useState } from 'react';
import { ShieldCheck, Truck, Sparkles, Check, ShoppingBag } from 'lucide-react';
import { ShopProduct, Artwork } from '../../types';

interface ShopCatalogProps {
  products: ShopProduct[];
  artworks: Artwork[];
  onAddToCart: (
    product: ShopProduct,
    artwork: Artwork | undefined,
    sizeName: string,
    sizeDimensions: string,
    framingName: string,
    price: number
  ) => void;
  onOpenArtwork: (artwork: Artwork) => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  products,
  artworks,
  onAddToCart,
  onOpenArtwork,
}) => {
  // Track selected size and frame per product id
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [selectedFramings, setSelectedFramings] = useState<Record<string, number>>({});
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const getArtwork = (artworkId: string) => artworks.find((a) => a.id === artworkId);

  const handleAddToCart = (product: ShopProduct) => {
    const artwork = getArtwork(product.artworkId);
    const sizeIndex = selectedSizes[product.id] || 0;
    const frameIndex = selectedFramings[product.id] || 0;

    const chosenSize = product.sizes[sizeIndex] || product.sizes[0];
    const chosenFrame = product.framingOptions[frameIndex] || product.framingOptions[0];

    const finalUnitPrice = chosenSize.price + (chosenFrame?.surcharge || 0);

    onAddToCart(
      product,
      artwork,
      chosenSize.name,
      chosenSize.dimensions,
      chosenFrame?.name || 'Standard',
      finalUnitPrice
    );

    setAddedNotice(product.id);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  return (
    <section className="py-12 lg:py-20 border-b border-[#e7e5e0] bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-stone-500 font-mono mb-2">
              <span>Editions &amp; Publications</span>
              <span aria-hidden="true">·</span>
              <span>Archival Substrates</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-stone-900 tracking-tight">
              Collector Prints &amp; Acquisitions
            </h2>
          </div>

          <p className="text-xs text-stone-600 max-w-md font-light leading-relaxed">
            All editions are hand-signed and numbered by <span className="text-gold font-medium">Navid Ali Bhatti</span> in pencil. Accompanied by a registered Hahnemühle holographic Certificate of Authenticity.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {products.map((product) => {
            const artwork = getArtwork(product.artworkId);
            const sizeIndex = selectedSizes[product.id] || 0;
            const frameIndex = selectedFramings[product.id] || 0;

            const currentSize = product.sizes[sizeIndex] || product.sizes[0];
            const currentFrame = product.framingOptions[frameIndex] || product.framingOptions[0];
            const calculatedPrice = currentSize.price + (currentFrame?.surcharge || 0);

            return (
              <div
                key={product.id}
                className="flex flex-col bg-white border border-[#e5e3dc] shadow-md hover:shadow-2xl hover:border-[#c59b27]/40 transition-all duration-300 rounded-2xl sm:rounded-3xl overflow-hidden p-6 sm:p-8 justify-between gap-6"
              >
                <div>
                  {/* Artwork Preview Thumbnail - Curved Picture */}
                  {artwork && (
                    <div
                      onClick={() => onOpenArtwork(artwork)}
                      className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-stone-950 mb-6 cursor-pointer group border-2 border-[#c59b27]/25 shadow-md"
                    >
                      <img
                        src={artwork.imageUrl}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-xs uppercase tracking-widest text-white bg-black/70 px-3.5 py-1.5 rounded-full border border-white/20">
                          Inspect Artwork
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Header / Titles */}
                  <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wider text-stone-500 mb-2">
                    <span className="text-gold font-medium">{product.productType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-400">Archival Edition</span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-stone-900 mb-3">
                    {product.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
                    {product.description}
                  </p>

                  {/* Size Selector */}
                  <div className="mb-5">
                    <label className="font-mono text-xs uppercase tracking-widest text-stone-600 block mb-2">
                      Edition Dimension
                    </label>
                    <div className="space-y-2">
                      {product.sizes.map((s, idx) => (
                        <button
                          key={s.name}
                          onClick={() =>
                            setSelectedSizes({ ...selectedSizes, [product.id]: idx })
                          }
                          className={`w-full flex items-center justify-between p-3 border text-left text-xs transition-colors rounded-xl cursor-pointer ${
                            sizeIndex === idx
                              ? 'bg-[#fcfbf9] border-[#c59b27] text-stone-900 font-medium shadow-xs'
                              : 'bg-white border-stone-200 text-stone-600 hover:text-black hover:border-stone-400'
                          }`}
                        >
                          <div>
                            <span className="block text-stone-900 font-serif">{s.name}</span>
                            <span className="text-[11px] text-stone-500 font-mono">
                              {s.dimensions}
                            </span>
                          </div>
                          <span className="font-mono text-sm tabular-nums text-gold font-semibold">
                            €{s.price.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Framing Options */}
                  {product.framingOptions.length > 1 && (
                    <div className="mb-6">
                      <label className="font-mono text-xs uppercase tracking-widest text-stone-600 block mb-2">
                        Museum Framing Specification
                      </label>
                      <div className="space-y-2">
                        {product.framingOptions.map((f, fIdx) => (
                          <button
                            key={f.name}
                            onClick={() =>
                              setSelectedFramings({ ...selectedFramings, [product.id]: fIdx })
                            }
                            className={`w-full flex items-center justify-between p-2.5 border text-left text-xs transition-colors rounded-xl cursor-pointer ${
                              frameIndex === fIdx
                                ? 'bg-[#fcfbf9] border-[#c59b27] text-stone-900 font-medium'
                                : 'bg-white border-stone-200 text-stone-600 hover:text-black hover:border-stone-400'
                            }`}
                          >
                            <span>{f.name}</span>
                            <span className="font-mono text-stone-700 tabular-nums">
                              {f.surcharge > 0 ? `+€${f.surcharge}` : 'Included'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trust specs */}
                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-stone-200 text-[11px] text-stone-600">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-stone-600 shrink-0" />
                      <span>Registered Hologram COA</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-stone-600 shrink-0" />
                      <span>Insured Art Crate Shipping</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Total & Purchase Trigger */}
                <div className="pt-4 flex items-center justify-between gap-4 border-t border-stone-100">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-500 font-mono block">
                      Total Valuation
                    </span>
                    <span className="font-mono text-2xl sm:text-3xl font-light text-gold tabular-nums font-semibold">
                      €{calculatedPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors rounded-sm cursor-pointer flex items-center gap-2.5 shrink-0 shadow-sm"
                  >
                    {addedNotice === product.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Added to Portfolio</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Acquire Edition</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
