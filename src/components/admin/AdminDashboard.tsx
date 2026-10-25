import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  Check,
  AlertCircle,
  RotateCcw,
  ShoppingBag,
  Inbox,
  LogOut,
  Sparkles,
  Layers,
  Palette,
  User,
} from 'lucide-react';
import { Artwork, ShopProduct, ContactInquiry, ArtworkCategory, GalleryTheme, ArtistProfile } from '../../types';
import {
  fetchAllArtworksAdmin,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  reorderArtworks,
  fetchProducts,
  updateProduct,
  fetchInquiries,
  updateInquiryStatus,
  loginAdmin,
  resetDatabaseToSeeds,
  getStoredAdminToken,
  setStoredAdminToken,
  fetchTheme,
  updateTheme,
  fetchProfile,
  updateProfile,
} from '../../services/api';
import { THEME_PRESETS, applyThemeToDocument, defaultTheme } from '../../data/themes';

interface AdminDashboardProps {
  onArtworkChanged: () => void;
  onExit: () => void;
  onThemeChanged?: (theme: GalleryTheme) => void;
  onProfileChanged?: (profile: ArtistProfile) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onArtworkChanged,
  onExit,
  onThemeChanged,
  onProfileChanged,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('164325');
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'artworks' | 'themes' | 'profile' | 'inquiries' | 'shop'>('artworks');

  // Data states
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [theme, setTheme] = useState<GalleryTheme>(defaultTheme);
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Artwork Editor modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingArtwork, setEditingArtwork] = useState<Partial<Artwork> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Check existing token
  useEffect(() => {
    const token = getStoredAdminToken();
    if (token) {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [artList, prodList, inqList, themeData, profileData] = await Promise.all([
        fetchAllArtworksAdmin(),
        fetchProducts(),
        fetchInquiries(),
        fetchTheme(),
        fetchProfile(),
      ]);
      setArtworks(artList);
      setProducts(prodList);
      setInquiries(inqList);
      if (themeData) setTheme(themeData);
      if (profileData) setProfile(profileData);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      const res = await loginAdmin(passkeyInput);
      if (res.success) {
        setIsAuthenticated(true);
        loadDashboardData();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Invalid passkey.');
    }
  };

  const handleLogout = () => {
    setStoredAdminToken(null);
    setIsAuthenticated(false);
  };

  const showSuccessNotice = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // --- Artwork Handlers ---

  const handleOpenCreateModal = () => {
    setIsCreatingNew(true);
    setEditingArtwork({
      title: '',
      series: 'Brutalist Coastlines',
      year: 2026,
      category: 'monochrome',
      medium: 'Archival Carbon Pigment on Hahnemühle Photo Rag 308g',
      dimensions: '150 × 100 cm',
      edition: 'Limited Edition of 5 + 1 AP',
      availableEditions: 3,
      price: 3600,
      currency: 'EUR',
      description: '',
      curatorialNotes: '',
      technicalDetails: {
        cameraOrEngine: 'Leica S3 Medium Format',
        lensOrAlgorithm: 'Summarit-S 70mm',
        captureYear: 2026,
        fileSpec: '16-bit Master File',
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
    setIsEditModalOpen(true);
  };

  const handleOpenEditModal = (art: Artwork) => {
    setIsCreatingNew(false);
    setEditingArtwork({ ...art });
    setImagePreview(art.imageUrl);
    setIsEditModalOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds the 10MB limit.');
      return;
    }

    // Convert to Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      if (editingArtwork) {
        setEditingArtwork({ ...editingArtwork, imageUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveArtwork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArtwork || !editingArtwork.title) return;

    try {
      if (isCreatingNew) {
        await createArtwork(editingArtwork);
        showSuccessNotice('New artwork created and added to the gallery catalog.');
      } else if (editingArtwork.id) {
        await updateArtwork(editingArtwork.id, editingArtwork);
        showSuccessNotice('Artwork specifications successfully updated.');
      }
      setIsEditModalOpen(false);
      await loadDashboardData();
      onArtworkChanged();
    } catch (err: any) {
      alert(err.message || 'Save failed.');
    }
  };

  const handleTogglePublish = async (art: Artwork) => {
    try {
      await updateArtwork(art.id, { published: !art.published });
      showSuccessNotice(
        art.published ? 'Artwork unpublished from public gallery.' : 'Artwork published to gallery.'
      );
      await loadDashboardData();
      onArtworkChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteArtwork = async (art: Artwork) => {
    if (!window.confirm(`Permanently remove "${art.title}" from the catalog?`)) return;
    try {
      await deleteArtwork(art.id);
      showSuccessNotice('Artwork removed from catalog.');
      await loadDashboardData();
      onArtworkChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleMoveArtwork = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= artworks.length) return;

    const copy = [...artworks];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);

    const orderedIds = copy.map((a) => a.id);
    try {
      await reorderArtworks(orderedIds);
      setArtworks(copy);
      onArtworkChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Inquiries Handler ---
  const handleUpdateInquiry = async (id: string, newStatus: ContactInquiry['status']) => {
    try {
      await updateInquiryStatus(id, newStatus);
      showSuccessNotice(`Inquiry marked as ${newStatus}.`);
      await loadDashboardData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Themes & Colours Handler ---
  const handleApplyThemePreset = async (t: GalleryTheme) => {
    setTheme(t);
    applyThemeToDocument(t);
    try {
      await updateTheme(t);
      if (onThemeChanged) onThemeChanged(t);
      showSuccessNotice(`Applied and saved "${t.name}" palette!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateCustomColor = (key: keyof GalleryTheme, val: string) => {
    const updated: GalleryTheme = { ...theme, id: 'custom', [key]: val };
    setTheme(updated);
    applyThemeToDocument(updated);
  };

  const handleSaveCurrentTheme = async () => {
    try {
      await updateTheme(theme);
      if (onThemeChanged) onThemeChanged(theme);
      showSuccessNotice('Custom website theme saved as active site default!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Profile Handler ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const res = await updateProfile(profile);
      setProfile(res.profile);
      if (onProfileChanged) onProfileChanged(res.profile);
      showSuccessNotice('Artist profile and biography saved!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Reset to Curated Seeds ---
  const handleResetCatalog = async () => {
    if (
      !window.confirm(
        'Restore the curatorial catalog, exhibitions, and shop editions to original pristine master state?'
      )
    )
      return;

    try {
      await resetDatabaseToSeeds();
      showSuccessNotice('Catalog restored to original curatorial seed state.');
      await loadDashboardData();
      onArtworkChanged();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- Render Login Gate ---
  if (!isAuthenticated) {
    return (
      <section className="py-20 max-w-xl mx-auto px-6">
        <div className="bg-white border border-[#e5e3dc] p-8 sm:p-10 rounded-sm shadow-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-stone-100 border border-stone-200 rounded-sm flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5 text-stone-700" />
            </div>
            <span className="text-xs uppercase font-mono tracking-widest text-stone-500 block mb-1">
              Studio Portal
            </span>
            <h2 className="font-serif text-3xl font-light text-stone-900">
              Artist CMS &amp; Curation Desk
            </h2>
            <p className="text-xs text-stone-600 font-light mt-2">
              Enter administrative passkey to manage Navid Ali Bhatti catalog raisonné, collector inquiries, and print editions.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-300 text-rose-900 text-xs rounded-sm mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1.5">
                Master Passkey
              </label>
              <input
                type="password"
                required
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                placeholder="Enter passkey"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-sm text-sm text-stone-900 focus:outline-none focus:border-stone-600"
              />
              <span className="text-[11px] font-mono text-stone-500 block mt-1">
                Studio master passkey: <code className="text-stone-800 font-bold">164325</code>
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onExit}
                className="text-xs uppercase tracking-wider text-stone-600 hover:text-black cursor-pointer"
              >
                Return to Gallery
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm transition-colors cursor-pointer shadow-sm"
              >
                Unlock Studio
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  // --- Render Authenticated Dashboard ---
  return (
    <section className="py-10 max-w-7xl mx-auto px-6 lg:px-12 text-stone-800 bg-[#faf9f6]">
      {/* Top Banner & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#e7e5e0] mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-stone-500 mb-1">
            <Unlock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Studio Administration</span>
            <span aria-hidden="true">·</span>
            <span>Navid Ali Bhatti</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-stone-900">
            Curatorial Content Management
          </h1>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetCatalog}
            title="Restore original seed catalog"
            className="px-3 py-2 text-xs uppercase tracking-wider text-stone-600 hover:text-black border border-stone-300 hover:border-stone-500 rounded-sm flex items-center gap-1.5 cursor-pointer bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Seeds</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs uppercase tracking-wider text-stone-700 hover:text-black border border-stone-300 hover:border-stone-500 rounded-sm flex items-center gap-1.5 cursor-pointer bg-white"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-sm flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e7e5e0] mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab('artworks')}
          className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'artworks'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-black'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Artworks &amp; Catalog ({artworks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('themes')}
          className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'themes'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-black'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-amber-600" />
          <span>Themes &amp; Colours</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-black'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Artist Profile &amp; Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'inquiries'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-black'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Inquiries ({inquiries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('shop')}
          className={`pb-3 px-3 text-xs uppercase tracking-[0.2em] cursor-pointer flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'shop'
              ? 'border-stone-900 text-stone-900 font-semibold'
              : 'border-transparent text-stone-500 hover:text-black'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Editions Pricing ({products.length})</span>
        </button>
      </div>

      {/* --- TAB 1: ARTWORKS MANAGER --- */}
      {activeTab === 'artworks' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs text-stone-600">
              Manage works, publication visibility, curatorial accession data, and display ordering.
            </p>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Artwork</span>
            </button>
          </div>

          <div className="bg-white border border-[#e5e3dc] shadow-sm rounded-sm overflow-hidden">
            <div className="divide-y divide-[#f0eee9]">
              {artworks.map((art, idx) => (
                <div
                  key={art.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-12 bg-stone-950 border border-stone-200 shrink-0 overflow-hidden rounded-xs">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                        <span className="text-stone-400">#{idx + 1}</span>
                        <span>{art.series}</span>
                        <span aria-hidden="true">·</span>
                        <span>{art.year}</span>
                        <span aria-hidden="true">·</span>
                        <span className="uppercase text-[10px] text-stone-500">{art.category}</span>
                      </div>
                      <h3 className="font-serif text-lg text-stone-900 font-light">
                        {art.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                        <span>{art.dimensions}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-stone-900 font-semibold">€{art.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 sm:self-center">
                    {/* Reorder Buttons */}
                    <button
                      onClick={() => handleMoveArtwork(idx, 'up')}
                      disabled={idx === 0}
                      title="Move Up in sequence"
                      className="p-1.5 text-stone-500 hover:text-black disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveArtwork(idx, 'down')}
                      disabled={idx === artworks.length - 1}
                      title="Move Down in sequence"
                      className="p-1.5 text-stone-500 hover:text-black disabled:opacity-20 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    {/* Publish / Unpublish Toggle */}
                    <button
                      onClick={() => handleTogglePublish(art)}
                      title={art.published ? 'Hide from public gallery' : 'Publish to gallery'}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        art.published ? 'text-emerald-700 hover:text-emerald-900' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {art.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit Spec */}
                    <button
                      onClick={() => handleOpenEditModal(art)}
                      title="Edit specifications"
                      className="p-1.5 text-stone-500 hover:text-black transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Artwork */}
                    <button
                      onClick={() => handleDeleteArtwork(art)}
                      title="Permanently remove"
                      className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: THEMES & WEBSITE COLOURS --- */}
      {activeTab === 'themes' && (
        <div className="space-y-8">
          <div>
            <h3 className="font-serif text-2xl font-light text-stone-900">Website Themes &amp; Live Colours</h3>
            <p className="text-xs text-stone-600 font-light mt-1">
              Select a curated fine art gallery palette or calibrate custom hex colors. Changes apply instantly across the entire website.
            </p>
          </div>

          {/* Curated Presets */}
          <div className="p-6 bg-white border border-[#e5e3dc] rounded-sm shadow-xs space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold">
              1. Curated Museum Palettes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {THEME_PRESETS.map((preset) => {
                const isCurrent = theme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyThemePreset(preset)}
                    className={`p-4 text-left border rounded-sm transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isCurrent ? 'ring-2 ring-stone-900 shadow-md' : 'hover:border-stone-400'
                    }`}
                    style={{
                      backgroundColor: preset.bgSurface,
                      borderColor: preset.borderColor,
                      color: preset.textPrimary,
                    }}
                  >
                    <div>
                      <span className="text-xs font-medium block">{preset.name}</span>
                      <span className="text-[10px] opacity-70 font-mono block mt-0.5">
                        {preset.isDark ? 'Darkroom Mode' : 'Light Gallery Mode'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-black/5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.bgCanvas }} title="Canvas" />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.bgSurface }} title="Surface" />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.accentColor }} title="Accent" />
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: preset.textPrimary }} title="Text" />
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Active</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Fine Tuning */}
          <div className="p-6 bg-white border border-[#e5e3dc] rounded-sm shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-widest text-stone-500 font-semibold">
                2. Custom Color Calibration
              </h4>
              <button
                type="button"
                onClick={() => {
                  setTheme(defaultTheme);
                  applyThemeToDocument(defaultTheme);
                }}
                className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Alabaster</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm space-y-1">
                <span className="font-mono text-[11px] uppercase text-stone-600 block">Canvas Background</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.bgCanvas}
                    onChange={(e) => handleUpdateCustomColor('bgCanvas', e.target.value)}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.bgCanvas}
                    onChange={(e) => handleUpdateCustomColor('bgCanvas', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-stone-300 rounded-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm space-y-1">
                <span className="font-mono text-[11px] uppercase text-stone-600 block">Card / Surface</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.bgSurface}
                    onChange={(e) => handleUpdateCustomColor('bgSurface', e.target.value)}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.bgSurface}
                    onChange={(e) => handleUpdateCustomColor('bgSurface', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-stone-300 rounded-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm space-y-1">
                <span className="font-mono text-[11px] uppercase text-stone-600 block">Primary Text</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.textPrimary}
                    onChange={(e) => handleUpdateCustomColor('textPrimary', e.target.value)}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.textPrimary}
                    onChange={(e) => handleUpdateCustomColor('textPrimary', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-stone-300 rounded-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm space-y-1">
                <span className="font-mono text-[11px] uppercase text-stone-600 block">Border Lines</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.borderColor}
                    onChange={(e) => handleUpdateCustomColor('borderColor', e.target.value)}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.borderColor}
                    onChange={(e) => handleUpdateCustomColor('borderColor', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-stone-300 rounded-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm space-y-1">
                <span className="font-mono text-[11px] uppercase text-stone-600 block">Accent Buttons</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => handleUpdateCustomColor('accentColor', e.target.value)}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => handleUpdateCustomColor('accentColor', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-stone-300 rounded-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-sm space-y-1">
                <span className="font-mono text-[11px] uppercase text-stone-600 block">Subtle Sections</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.bgSubtle}
                    onChange={(e) => handleUpdateCustomColor('bgSubtle', e.target.value)}
                    className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={theme.bgSubtle}
                    onChange={(e) => handleUpdateCustomColor('bgSubtle', e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono bg-white border border-stone-300 rounded-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#e7e5e0]">
              <button
                type="button"
                onClick={handleSaveCurrentTheme}
                className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Current Theme as Default</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: ARTIST PROFILE & BIO --- */}
      {activeTab === 'profile' && profile && (
        <div className="p-6 bg-white border border-[#e5e3dc] rounded-sm shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-2xl font-light text-stone-900">Artist Profile &amp; Monograph</h3>
            <p className="text-xs text-stone-600 font-light mt-1">
              Live edit Navid Ali Bhatti's biographical statement, studio addresses, and contact emails.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                  Artist Full Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-sm text-sm text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                  Disciplinary Title
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                  Studio Locations
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-600"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="block text-xs uppercase tracking-widest font-mono text-stone-600 font-semibold">
                Biography Paragraphs
              </label>
              {profile.biography.map((para, idx) => (
                <div key={idx}>
                  <span className="text-[10px] font-mono uppercase text-stone-400 block mb-0.5">
                    Paragraph {idx + 1}
                  </span>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const updated = [...profile.biography];
                      updated[idx] = e.target.value;
                      setProfile({ ...profile, biography: updated });
                    }}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 font-light leading-relaxed focus:outline-none focus:border-stone-600"
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                  Studio Email
                </label>
                <input
                  type="email"
                  value={profile.contact.studioEmail}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contact: { ...profile.contact, studioEmail: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 font-mono focus:outline-none focus:border-stone-600"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                  Studio Physical Address
                </label>
                <input
                  type="text"
                  value={profile.contact.studioAddress}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      contact: { ...profile.contact, studioAddress: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#e7e5e0]">
              <button
                type="submit"
                className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile Updates</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- TAB 2: INQUIRIES & ORDERS INBOX --- */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <p className="text-xs text-stone-600">
            Messages transmitted via the studio desk and collector print acquisition reservations.
          </p>

          <div className="divide-y divide-[#e7e5e0] bg-white border border-[#e5e3dc] shadow-sm rounded-sm">
            {inquiries.length === 0 ? (
              <div className="p-12 text-center text-stone-500 text-xs">
                No inquiries registered yet.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                        <span className="uppercase text-stone-800 font-semibold">{inq.type}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                        {inq.artworkReference && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-stone-900 font-serif">Ref: {inq.artworkReference}</span>
                          </>
                        )}
                      </div>
                      <h4 className="font-serif text-lg text-stone-900 font-light mt-0.5">
                        {inq.subject}
                      </h4>
                      <p className="text-xs text-stone-600">
                        From: <strong className="text-stone-900">{inq.name}</strong> ({inq.email})
                      </p>
                    </div>

                    {/* Status Pill Actions */}
                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => handleUpdateInquiry(inq.id, e.target.value as any)}
                        className="bg-stone-100 border border-stone-300 rounded-sm px-2.5 py-1 text-xs text-stone-800 focus:outline-none cursor-pointer"
                      >
                        <option value="new">Status: New</option>
                        <option value="reviewed">Status: Under Review</option>
                        <option value="responded">Status: Responded</option>
                        <option value="archived">Status: Archived</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-light whitespace-pre-line bg-stone-50 p-4 border border-stone-200 rounded-sm">
                    {inq.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: EDITIONS & SHOP PRODUCTS --- */}
      {activeTab === 'shop' && (
        <div className="space-y-6">
          <p className="text-xs text-stone-600">
            Configure edition pricing, available formats, and museum framing surcharges.
          </p>

          <div className="grid grid-cols-1 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-6 bg-white border border-[#e5e3dc] shadow-sm rounded-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-4">
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-500">
                      {prod.productType}
                    </span>
                    <h3 className="font-serif text-xl text-stone-900 font-light">
                      {prod.title}
                    </h3>
                  </div>
                  <span className="font-mono text-sm text-stone-900 font-semibold">
                    Base: €{prod.basePrice.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {prod.sizes.map((s, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 border border-stone-200 rounded-sm">
                      <span className="font-serif text-stone-900 block">{s.name}</span>
                      <span className="text-[11px] text-stone-500 font-mono block mb-2">
                        {s.dimensions}
                      </span>
                      <span className="font-mono text-stone-900 tabular-nums font-semibold">
                        €{s.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ARTWORK EDITOR MODAL --- */}
      {isEditModalOpen && editingArtwork && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="w-full max-w-3xl bg-[#faf9f6] border border-[#e5e3dc] shadow-2xl rounded-sm p-6 sm:p-10 my-8 max-h-[90vh] overflow-y-auto text-stone-900">
            <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e0] mb-6">
              <h2 className="font-serif text-2xl font-light text-stone-900">
                {isCreatingNew ? 'Register New Artwork' : `Edit Artwork: ${editingArtwork.title}`}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-500 hover:text-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveArtwork} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Artwork Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingArtwork.title || ''}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Series / Collection
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.series || ''}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, series: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none focus:border-stone-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Category
                  </label>
                  <select
                    value={editingArtwork.category || 'monochrome'}
                    onChange={(e) =>
                      setEditingArtwork({
                        ...editingArtwork,
                        category: e.target.value as ArtworkCategory,
                      })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none cursor-pointer"
                  >
                    <option value="monochrome">Monochrome Photography</option>
                    <option value="generative">Algorithmic &amp; Generative</option>
                    <option value="architectural">Brutalist Architecture</option>
                    <option value="conceptual">Conceptual Voids</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Year of Creation
                  </label>
                  <input
                    type="number"
                    value={editingArtwork.year || 2026}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, year: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Valuation (EUR)
                  </label>
                  <input
                    type="number"
                    value={editingArtwork.price || 3000}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Medium & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Medium &amp; Substrate
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.medium || ''}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, medium: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                    Dimensions (Metric &amp; Imperial)
                  </label>
                  <input
                    type="text"
                    value={editingArtwork.dimensions || ''}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, dimensions: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Upload or Asset Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-2">
                  Artwork Visual Media (Upload file or select existing)
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Live preview */}
                  <div className="w-36 h-24 bg-stone-950 border border-stone-200 rounded-xs overflow-hidden shrink-0">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm text-xs uppercase tracking-wider cursor-pointer shadow-xs">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Local File (JPG, PNG, WebP &lt; 10MB)</span>
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/svg+xml"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-wrap gap-2 text-xs text-stone-500 pt-1">
                      <span>Or pick catalog asset:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('/art/monolith_fog.svg');
                          setEditingArtwork({ ...editingArtwork, imageUrl: '/art/monolith_fog.svg' });
                        }}
                        className="underline text-stone-700 hover:text-black cursor-pointer"
                      >
                        Monolith IV
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('/art/chroma_void.svg');
                          setEditingArtwork({ ...editingArtwork, imageUrl: '/art/chroma_void.svg' });
                        }}
                        className="underline text-stone-700 hover:text-black cursor-pointer"
                      >
                        Chroma Void
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('/art/basalt_stack.svg');
                          setEditingArtwork({ ...editingArtwork, imageUrl: '/art/basalt_stack.svg' });
                        }}
                        className="underline text-stone-700 hover:text-black cursor-pointer"
                      >
                        Basalt Tower
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('/art/algorithmic_flora.svg');
                          setEditingArtwork({ ...editingArtwork, imageUrl: '/art/algorithmic_flora.svg' });
                        }}
                        className="underline text-stone-700 hover:text-black cursor-pointer"
                      >
                        Algorithmic Flora
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-stone-600 mb-1">
                  Description &amp; Curatorial Notes
                </label>
                <textarea
                  rows={3}
                  value={editingArtwork.description || ''}
                  onChange={(e) =>
                    setEditingArtwork({ ...editingArtwork, description: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-sm text-xs text-stone-900 focus:outline-none resize-none"
                />
              </div>

              {/* Checkboxes: Published & Featured */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArtwork.published)}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, published: e.target.checked })
                    }
                    className="accent-stone-900"
                  />
                  <span>Publish in Public Gallery</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingArtwork.featured)}
                    onChange={(e) =>
                      setEditingArtwork({ ...editingArtwork, featured: e.target.checked })
                    }
                    className="accent-stone-900"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-[#e7e5e0] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs uppercase tracking-wider text-stone-500 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium bg-stone-900 text-stone-50 hover:bg-stone-800 rounded-sm transition-colors cursor-pointer shadow-sm"
                >
                  {isCreatingNew ? 'Create Artwork' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
