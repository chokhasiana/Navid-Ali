import React, { useState, useEffect } from 'react';
import { X, Upload, Sparkles, Check, Image as ImageIcon, Eye } from 'lucide-react';
import { Artwork, ArtworkCategory } from '../../types';
import { createArtwork, updateArtwork } from '../../services/api';

interface QuickArtworkModalProps {
  isOpen: boolean;
  artworkToEdit?: Artwork | null;
  onClose: () => void;
  onArtworkSaved: (artwork: Artwork) => void;
}

const PRESET_IMAGE_PLATES = [
  { label: 'Monolith in Fog', url: '/art/monolith_fog.svg' },
  { label: 'Quantum Indigo Void', url: '/art/chroma_void.svg' },
  { label: 'Basalt Tower Surf', url: '/art/basalt_stack.svg' },
  { label: 'Algorithmic Flora', url: '/art/algorithmic_flora.svg' },
  { label: 'Cantilever in Rain', url: '/art/cantilever_rain.svg' },
  { label: 'Event Horizon Void', url: '/art/event_horizon.svg' },
];

export const QuickArtworkModal: React.FC<QuickArtworkModalProps> = ({
  isOpen,
  artworkToEdit,
  onClose,
  onArtworkSaved,
}) => {
  const isEditing = Boolean(artworkToEdit);

  const [formData, setFormData] = useState<Partial<Artwork>>({
    title: '',
    series: 'Brutalist Coastlines',
    year: new Date().getFullYear(),
    category: 'monochrome',
    medium: 'Archival Carbon Pigment on Hahnemühle Photo Rag 308g',
    dimensions: '150 × 100 cm / 59 × 39.4 in',
    edition: 'Limited Edition of 5 + 1 AP',
    availableEditions: 3,
    price: 3800,
    currency: 'EUR',
    description: '',
    curatorialNotes: '',
    technicalDetails: {
      cameraOrEngine: 'Large Format 8x10 Field Camera',
      lensOrAlgorithm: 'Schneider Kreuznach 300mm',
      captureYear: new Date().getFullYear(),
      fileSpec: '16-bit Master File / 24,000 × 16,000 px',
    },
    imageUrl: '/art/monolith_fog.svg',
    artStyle: 'Architectural Fine Art Photography',
    aspectRatio: '16:9',
    featured: false,
    published: true,
    exhibitions: [],
    awards: [],
  });

  const [imagePreview, setImagePreview] = useState<string>('/art/monolith_fog.svg');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (artworkToEdit) {
      setFormData({ ...artworkToEdit });
      setImagePreview(artworkToEdit.imageUrl);
    } else {
      setFormData({
        title: '',
        series: 'Brutalist Coastlines',
        year: new Date().getFullYear(),
        category: 'monochrome',
        medium: 'Archival Carbon Pigment on Hahnemühle Photo Rag 308g',
        dimensions: '150 × 100 cm / 59 × 39.4 in',
        edition: 'Limited Edition of 5 + 1 AP',
        availableEditions: 3,
        price: 3800,
        currency: 'EUR',
        description: '',
        curatorialNotes: '',
        technicalDetails: {
          cameraOrEngine: 'Large Format 8x10 Field Camera',
          lensOrAlgorithm: 'Schneider Kreuznach 300mm',
          captureYear: new Date().getFullYear(),
          fileSpec: '16-bit Master File / 24,000 × 16,000 px',
        },
        imageUrl: '/art/monolith_fog.svg',
        artStyle: 'Architectural Fine Art Photography',
        aspectRatio: '16:9',
        featured: false,
        published: true,
        exhibitions: [],
        awards: [],
      });
      setImagePreview('/art/monolith_fog.svg');
    }
    setErrorMsg(null);
  }, [artworkToEdit, isOpen]);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 15MB limit. Please choose an optimized file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImagePreview(dataUrl);
        setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
        setErrorMsg(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.title?.trim()) {
      setErrorMsg('Please specify an artwork title.');
      return;
    }

    if (!formData.imageUrl?.trim()) {
      setErrorMsg('Please provide or upload an artwork image.');
      return;
    }

    setIsSubmitting(true);
    try {
      let saved: Artwork;
      if (isEditing && artworkToEdit) {
        saved = await updateArtwork(artworkToEdit.id, formData);
      } else {
        saved = await createArtwork(formData);
      }
      onArtworkSaved(saved);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save artwork to gallery.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isEditing ? 'Edit Artwork' : 'Upload New Art'}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto text-stone-900"
    >
      <div className="w-full max-w-4xl bg-[#faf9f6] border border-[#e5e3dc] shadow-2xl rounded-3xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e0] mb-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-gold" />
            <div>
              <h2 className="font-serif text-2xl font-light text-stone-900">
                {isEditing ? `Live Edit: ${artworkToEdit?.title}` : 'Upload New Artwork to Catalog'}
              </h2>
              <p className="text-xs text-stone-500 font-light mt-0.5">
                <span className="text-gold font-medium">Navid Ali Bhatti</span> Studio · Real-time accession catalog integration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-6 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-sm font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Image Upload & Live Visual Preview (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <label className="block text-xs uppercase tracking-widest font-mono text-stone-600 font-semibold">
                Artwork Visual &amp; Media
              </label>

              {/* Live Preview Box with Curved Picture Frame */}
              <div className="relative aspect-[16/9] w-full bg-stone-950 border-2 border-[#c59b27]/30 rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                ) : (
                  <div className="text-stone-500 text-center p-4">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <span className="text-xs font-mono">No Image Selected</span>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-[10px] text-white font-mono rounded">
                  {formData.aspectRatio}
                </span>
              </div>

              {/* Upload input button */}
              <div className="p-4 bg-white border border-dashed border-stone-300 rounded-sm text-center">
                <input
                  type="file"
                  id="artwork-file-upload"
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="artwork-file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-sm cursor-pointer transition-colors border border-stone-300"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local File (JPG / PNG / SVG)</span>
                </label>
                <p className="text-[11px] text-stone-500 mt-2 font-mono">
                  Drag file or click to select from your device.
                </p>
              </div>

              {/* Or select sample plates */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-1.5">
                  Or select curated plate template:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_IMAGE_PLATES.map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setImagePreview(p.url);
                        setFormData((prev) => ({ ...prev, imageUrl: p.url }));
                      }}
                      className={`text-[10px] p-1.5 border rounded-sm truncate text-left transition-colors cursor-pointer ${
                        formData.imageUrl === p.url
                          ? 'border-stone-900 bg-stone-100 font-semibold'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                      title={p.label}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Or paste custom URL */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-1">
                  Or paste direct image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, imageUrl: e.target.value }));
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-sm text-xs font-mono text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>
            </div>

            {/* Right Column: Metadata & Curatorial Sheet (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Artwork Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Monolith IX: Basalt Dawn"
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-sm text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                {/* Series */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Oeuvre Series
                  </label>
                  <input
                    type="text"
                    value={formData.series || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, series: e.target.value }))}
                    placeholder="e.g. Brutalist Coastlines"
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Year of Production
                  </label>
                  <input
                    type="number"
                    value={formData.year || new Date().getFullYear()}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600 font-mono"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as ArtworkCategory,
                      }))
                    }
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  >
                    <option value="monochrome">Monochrome Photography</option>
                    <option value="chromatic">Chromatic Photography</option>
                    <option value="generative">Algorithmic & Generative</option>
                    <option value="architectural">Brutalist Architecture</option>
                    <option value="conceptual">Conceptual Voids</option>
                  </select>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={formData.aspectRatio}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        aspectRatio: e.target.value as any,
                      }))
                    }
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600 font-mono"
                  >
                    <option value="16:9">16:9 (Cinematic Landscape)</option>
                    <option value="4:3">4:3 (Classic Exhibition)</option>
                    <option value="3:4">3:4 (Vertical Portrait)</option>
                    <option value="1:1">1:1 (Square Monolith)</option>
                  </select>
                </div>

                {/* Medium & Substrate */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Medium &amp; Substrate
                  </label>
                  <input
                    type="text"
                    value={formData.medium || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, medium: e.target.value }))}
                    placeholder="e.g. Archival Carbon Pigment on Hahnemühle Photo Rag 308g"
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                {/* Physical Dimensions */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="180 × 120 cm / 70.8 × 47.2 in"
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600 font-mono"
                  />
                </div>

                {/* Valuation Price (€) in Gold */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-gold mb-1 font-semibold">
                    Valuation Price (€ EUR)
                  </label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2 bg-white border border-[#c59b27]/50 rounded-sm text-sm text-gold font-bold focus:outline-none focus:border-[#c59b27] font-mono"
                  />
                </div>

                {/* Edition & Remaining */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Edition Rule
                  </label>
                  <input
                    type="text"
                    value={formData.edition || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, edition: e.target.value }))}
                    placeholder="Limited Edition of 5 + 1 AP"
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Available Copies
                  </label>
                  <input
                    type="number"
                    value={formData.availableEditions || 1}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, availableEditions: Number(e.target.value) }))
                    }
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600 font-mono"
                  />
                </div>

                {/* Curatorial Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Curatorial Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Short narrative on the artwork's subject, light conditions, and composition."
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                {/* Technical Apparatus / Camera */}
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-white border border-stone-200 rounded-sm">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-1">
                      Camera / Engine
                    </label>
                    <input
                      type="text"
                      value={formData.technicalDetails?.cameraOrEngine || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          technicalDetails: {
                            ...prev.technicalDetails!,
                            cameraOrEngine: e.target.value,
                          },
                        }))
                      }
                      placeholder="Deardorff 8x10 / Metal Shader"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xs text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-mono text-stone-500 mb-1">
                      Lens / Algorithm
                    </label>
                    <input
                      type="text"
                      value={formData.technicalDetails?.lensOrAlgorithm || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          technicalDetails: {
                            ...prev.technicalDetails!,
                            lensOrAlgorithm: e.target.value,
                          },
                        }))
                      }
                      placeholder="Schneider Kreuznach 300mm"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-xs text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.featured)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                    />
                    <span>Feature on Homepage Spotlight</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.published)}
                      onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                      className="rounded border-stone-300 text-stone-900 focus:ring-stone-500"
                    />
                    <span>Publish in Public Gallery</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#e7e5e0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-black cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving Artwork...' : isEditing ? 'Update Artwork' : 'Upload to Gallery'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
