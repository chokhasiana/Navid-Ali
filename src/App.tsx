import React, { useState, useEffect } from 'react';
import { TopBar } from './components/navigation/TopBar';
import { HeroSection } from './components/home/HeroSection';
import { ArtworkCard } from './components/gallery/ArtworkCard';
import { GalleryCatalog } from './components/gallery/GalleryCatalog';
import { ShopCatalog } from './components/shop/ShopCatalog';
import { CartDrawer } from './components/shop/CartDrawer';
import { CollectorCheckoutModal } from './components/shop/CollectorCheckoutModal';
import { AboutSection } from './components/about/AboutSection';
import { ContactSection } from './components/contact/ContactSection';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ArtworkLightbox } from './components/lightbox/ArtworkLightbox';
import { LegalModal } from './components/legal/LegalModal';
import { Footer } from './components/layout/Footer';
import { CuratorLiveBar } from './components/admin/CuratorLiveBar';
import { CuratorAuthModal } from './components/admin/CuratorAuthModal';
import { ThemeEditorModal } from './components/admin/ThemeEditorModal';
import { QuickArtworkModal } from './components/admin/QuickArtworkModal';
import { ArtistProfileModal } from './components/admin/ArtistProfileModal';
import { Artwork, ShopProduct, CartItem, GalleryTheme, ArtistProfile } from './types';
import { initialArtworks, initialShopProducts, initialArtistProfile } from './data/initialData';
import {
  fetchArtworks,
  fetchProducts,
  fetchTheme,
  fetchProfile,
  getStoredAdminToken,
  setStoredAdminToken,
} from './services/api';
import { defaultTheme, applyThemeToDocument } from './data/themes';
import { ArrowRight, Sparkles, Plus, Palette } from 'lucide-react';

const CART_STORAGE_KEY = 'nab_gallery_cart_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'gallery' | 'shop' | 'about' | 'contact' | 'admin'>('home');
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [products, setProducts] = useState<ShopProduct[]>(initialShopProducts);
  const [profile, setProfile] = useState<ArtistProfile>(initialArtistProfile);
  const [theme, setTheme] = useState<GalleryTheme>(defaultTheme);

  // Curator mode & live edit states
  const [isCuratorLoggedIn, setIsCuratorLoggedIn] = useState<boolean>(false);
  const [isEditModeActive, setIsEditModeActive] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState<boolean>(false);
  const [artworkBeingEdited, setArtworkBeingEdited] = useState<Artwork | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Lightbox state
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isWallModeInitial, setIsWallModeInitial] = useState<boolean>(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Inquiries / Contact pre-selection
  const [contactArtworkRef, setContactArtworkRef] = useState<string | undefined>(undefined);

  // Legal Modal
  const [legalModalType, setLegalModalType] = useState<'impressum' | 'datenschutz' | null>(null);

  // Load backend data
  const loadData = async () => {
    try {
      const [fetchedArts, fetchedProds, fetchedTheme, fetchedProfile] = await Promise.all([
        fetchArtworks(),
        fetchProducts(),
        fetchTheme(),
        fetchProfile(),
      ]);
      if (fetchedArts && fetchedArts.length > 0) {
        setArtworks(fetchedArts);
      }
      if (fetchedProds && fetchedProds.length > 0) {
        setProducts(fetchedProds);
      }
      if (fetchedTheme) {
        setTheme(fetchedTheme);
        applyThemeToDocument(fetchedTheme);
      }
      if (fetchedProfile) {
        setProfile(fetchedProfile);
      }
    } catch (err) {
      console.warn('Using client initial datasets', err);
    }
  };

  useEffect(() => {
    loadData();
    // Check if curator token is saved
    const token = getStoredAdminToken();
    if (token) {
      setIsCuratorLoggedIn(true);
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [cartItems]);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Featured artwork for hero
  const featuredArtwork = artworks.find((a) => a.featured) || artworks[0] || initialArtworks[0];

  // Lightbox triggers
  const handleOpenArtwork = (artwork: Artwork, wallMode = false) => {
    setActiveArtwork(artwork);
    setIsWallModeInitial(wallMode);
    setIsLightboxOpen(true);
  };

  const handleInquireArtwork = (artwork: Artwork) => {
    setContactArtworkRef(`${artwork.title} (${artwork.series}, ${artwork.year})`);
    setActiveTab('contact');
    setIsLightboxOpen(false);
  };

  // Curator Live Actions
  const handleUploadNewArt = () => {
    setArtworkBeingEdited(null);
    setIsArtworkModalOpen(true);
  };

  const handleQuickEditArtwork = (artwork: Artwork) => {
    setArtworkBeingEdited(artwork);
    setIsArtworkModalOpen(true);
  };

  const handleArtworkSaved = (savedArt: Artwork) => {
    setArtworks((prev) => {
      const index = prev.findIndex((a) => a.id === savedArt.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = savedArt;
        return copy;
      }
      return [savedArt, ...prev];
    });
    loadData();
  };

  const handleThemeSaved = (newTheme: GalleryTheme) => {
    setTheme(newTheme);
    applyThemeToDocument(newTheme);
  };

  const handleProfileSaved = (newProfile: ArtistProfile) => {
    setProfile(newProfile);
  };

  const handleCuratorLogout = () => {
    setStoredAdminToken(null);
    setIsCuratorLoggedIn(false);
    setIsEditModeActive(false);
  };

  // Cart Operations
  const handleAddToCart = (
    product: ShopProduct,
    artwork: Artwork | undefined,
    sizeName: string,
    sizeDimensions: string,
    framingName: string,
    unitPrice: number
  ) => {
    const itemId = `${product.id}-${sizeName}-${framingName}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          artworkId: product.artworkId,
          title: product.title,
          imageUrl: artwork?.imageUrl || '/art/monolith_fog.svg',
          sizeName,
          sizeDimensions,
          framingName,
          unitPrice,
          quantity: 1,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div
      className="min-h-screen flex flex-col font-sans transition-colors duration-300 relative"
      style={{
        backgroundColor: theme.bgCanvas,
        color: theme.textPrimary,
      }}
    >
      {/* Tiny Golden Lion Face Logo repeating background watermark */}
      <div
        className="fixed inset-0 pointer-events-none z-0 lion-bg-pattern opacity-[0.065] select-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col flex-1">
        {/* 3-Zone Top Navigation Bar */}
      <TopBar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab !== 'contact') setContactArtworkRef(undefined);
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        isCuratorLoggedIn={isCuratorLoggedIn}
        onOpenCuratorAuth={() => setIsAuthModalOpen(true)}
        onOpenThemeEditor={() => setIsThemeModalOpen(true)}
        onOpenUploadArt={handleUploadNewArt}
      />

      {/* Main Page Content Body */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* Grand Hero Section */}
            <HeroSection
              featuredArtwork={featuredArtwork}
              onExploreGallery={() => setActiveTab('gallery')}
              onInquire={() => setActiveTab('contact')}
              onOpenArtwork={(art) => handleOpenArtwork(art)}
            />

            {/* Curated Selected Works Spotlight (Preview) */}
            <section
              className="py-16 lg:py-24 border-b transition-colors"
              style={{
                backgroundColor: theme.bgCanvas,
                borderColor: theme.borderColor,
              }}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div>
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-mono mb-2" style={{ color: theme.textMuted }}>
                      <span>Curated Selection</span>
                      <span aria-hidden="true">·</span>
                      <span>Key Plates</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-tight" style={{ color: theme.textPrimary }}>
                      Selected Monoliths &amp; Light Manifolds
                    </h2>
                  </div>

                  <div className="flex items-center gap-4">
                    {isCuratorLoggedIn && isEditModeActive && (
                      <button
                        onClick={handleUploadNewArt}
                        className="px-3 py-1.5 text-xs uppercase tracking-wider font-medium bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-sm cursor-pointer flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload Artwork</span>
                      </button>
                    )}

                    <button
                      onClick={() => setActiveTab('gallery')}
                      className="text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center gap-2 cursor-pointer pb-1 border-b"
                      style={{
                        color: theme.textPrimary,
                        borderColor: theme.textPrimary,
                      }}
                    >
                      <span>View Complete Oeuvre</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 3-Column Preview Grid with in-place live edit */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {artworks.slice(0, 3).map((art) => (
                    <ArtworkCard
                      key={art.id}
                      artwork={art}
                      onOpen={(a) => handleOpenArtwork(a)}
                      onOpenWallView={(a) => handleOpenArtwork(a, true)}
                      onInquire={handleInquireArtwork}
                      isCuratorMode={isCuratorLoggedIn && isEditModeActive}
                      onQuickEdit={handleQuickEditArtwork}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Collector Editions Spotlight Preview */}
            <section
              className="py-16 lg:py-24 border-b transition-colors"
              style={{
                backgroundColor: theme.bgSubtle,
                borderColor: theme.borderColor,
              }}
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6">
                    <span className="font-mono text-xs uppercase tracking-widest block mb-2" style={{ color: theme.textMuted }}>
                      Master Darkroom &amp; Substrates
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-light mb-6" style={{ color: theme.textPrimary }}>
                      Archival Carbon Pigment &amp; Brushed Aluminium Dibond
                    </h2>
                    <p className="text-sm font-light leading-relaxed mb-6" style={{ color: theme.textSecondary }}>
                      Every limited edition is master-printed under the direct supervision of <span className="text-gold font-medium">{profile.name}</span>. We use genuine carbon pigment formulations providing lightfastness guaranteed past 120 years under museum preservation standards.
                    </p>
                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => setActiveTab('shop')}
                        className="px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium rounded-sm cursor-pointer shadow-sm transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: theme.accentColor,
                          color: theme.accentContrast,
                        }}
                      >
                        Browse Collector Editions
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div
                      className="p-8 border rounded-sm space-y-6 shadow-sm"
                      style={{
                        backgroundColor: theme.bgSurface,
                        borderColor: theme.borderColor,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 shrink-0 mt-1" style={{ color: theme.accentColor }} />
                        <div>
                          <h4 className="font-serif text-lg" style={{ color: theme.textPrimary }}>Registered Hologram COA</h4>
                          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                            Each physical piece is numbered and signed with a registered Hahnemühle Certificate of Authenticity containing matching security holograms.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 pt-4 border-t" style={{ borderColor: theme.borderColor }}>
                        <Sparkles className="w-4 h-4 shrink-0 mt-1" style={{ color: theme.accentColor }} />
                        <div>
                          <h4 className="font-serif text-lg" style={{ color: theme.textPrimary }}>Insured Temperature-Controlled Crating</h4>
                          <p className="text-xs mt-0.5" style={{ color: theme.textSecondary }}>
                            Editions larger than 120cm are framed in museum anti-reflective glass and dispatched in custom wooden art crates with international courier tracking.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Gallery / Portfolio Full Catalog with Live In-Place Edit */}
        {activeTab === 'gallery' && (
          <GalleryCatalog
            artworks={artworks}
            onOpenArtwork={(art) => handleOpenArtwork(art)}
            onOpenWallView={(art) => handleOpenArtwork(art, true)}
            onInquire={handleInquireArtwork}
            isCuratorMode={isCuratorLoggedIn && isEditModeActive}
            onQuickEdit={handleQuickEditArtwork}
          />
        )}

        {/* Shop / Collector Editions */}
        {activeTab === 'shop' && (
          <ShopCatalog
            products={products}
            artworks={artworks}
            onAddToCart={handleAddToCart}
            onOpenArtwork={(art) => handleOpenArtwork(art)}
          />
        )}

        {/* Biography & Monographs */}
        {activeTab === 'about' && (
          <AboutSection
            profile={profile}
            onNavigateContact={() => setActiveTab('contact')}
          />
        )}

        {/* Studio Contact */}
        {activeTab === 'contact' && (
          <ContactSection
            initialArtworkRef={contactArtworkRef}
            onClearArtworkRef={() => setContactArtworkRef(undefined)}
          />
        )}

        {/* Admin CMS */}
        {activeTab === 'admin' && (
          <AdminDashboard
            onArtworkChanged={loadData}
            onExit={() => setActiveTab('gallery')}
            onThemeChanged={(newT) => {
              setTheme(newT);
              applyThemeToDocument(newT);
            }}
            onProfileChanged={(newP) => setProfile(newP)}
          />
        )}
      </main>

      {/* Floating Curator Live Control Bar (Accessible when logged in) */}
      {isCuratorLoggedIn && (
        <CuratorLiveBar
          currentTheme={theme}
          isEditModeActive={isEditModeActive}
          onToggleEditMode={() => setIsEditModeActive(!isEditModeActive)}
          onOpenUploadArt={handleUploadNewArt}
          onOpenThemeEditor={() => setIsThemeModalOpen(true)}
          onOpenProfileEditor={() => setIsProfileModalOpen(true)}
          onOpenFullCMS={() => setActiveTab('admin')}
          onLogout={handleCuratorLogout}
        />
      )}

      {/* Password Protection Authentication Modal (Master Password: 164325) */}
      <CuratorAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsCuratorLoggedIn(true);
          setIsEditModeActive(true);
        }}
      />

      {/* Live Website Theme & Colours Editor Modal */}
      <ThemeEditorModal
        isOpen={isThemeModalOpen}
        currentTheme={theme}
        onClose={() => setIsThemeModalOpen(false)}
        onThemeSaved={handleThemeSaved}
      />

      {/* Live Quick Artwork Upload & Edit Modal */}
      <QuickArtworkModal
        isOpen={isArtworkModalOpen}
        artworkToEdit={artworkBeingEdited}
        onClose={() => {
          setIsArtworkModalOpen(false);
          setArtworkBeingEdited(null);
        }}
        onArtworkSaved={handleArtworkSaved}
      />

      {/* Live Artist Profile & Bio Editor Modal */}
      <ArtistProfileModal
        isOpen={isProfileModalOpen}
        profile={profile}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={handleProfileSaved}
      />

      {/* Fullscreen Artwork Lightbox Modal with Zoom & Wall Simulator */}
      {activeArtwork && (
        <ArtworkLightbox
          artwork={activeArtwork}
          artworks={artworks}
          isOpen={isLightboxOpen}
          initialWallMode={isWallModeInitial}
          onClose={() => setIsLightboxOpen(false)}
          onSelectArtwork={(art) => setActiveArtwork(art)}
          onInquire={handleInquireArtwork}
        />
      )}

      {/* Collector Portfolio Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Collector Acquisition Reservation & Invoice Modal */}
      <CollectorCheckoutModal
        isOpen={isCheckoutOpen}
        items={cartItems}
        onClose={() => setIsCheckoutOpen(false)}
        onClearCart={handleClearCart}
      />

      {/* Legal Disclaimers (Impressum & Datenschutz) */}
      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType || 'impressum'}
        onClose={() => setLegalModalType(null)}
      />

      {/* Gallery Editorial Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab !== 'contact') setContactArtworkRef(undefined);
        }}
        onOpenLegal={(type) => setLegalModalType(type)}
      />
      </div>
    </div>
  );
}
