export type ArtworkCategory = 'monochrome' | 'chromatic' | 'generative' | 'architectural' | 'conceptual';

export interface ArtworkTechnicalDetails {
  cameraOrEngine: string;
  lensOrAlgorithm: string;
  captureYear: number;
  fileSpec: string;
}

export interface Artwork {
  id: string;
  title: string;
  series: string;
  year: number;
  category: ArtworkCategory;
  medium: string;
  dimensions: string;
  edition: string;
  availableEditions: number;
  price: number;
  currency: 'EUR';
  description: string;
  curatorialNotes: string;
  technicalDetails: ArtworkTechnicalDetails;
  imageUrl: string;
  artStyle: string;
  aspectRatio: '16:9' | '4:3' | '3:4' | '1:1';
  featured: boolean;
  published: boolean;
  sortOrder: number;
  exhibitions: string[];
  awards: string[];
}

export interface ProductSizeOption {
  name: string;
  dimensions: string;
  price: number;
  available: boolean;
}

export interface ProductFramingOption {
  name: string;
  surcharge: number;
}

export interface ShopProduct {
  id: string;
  artworkId: string;
  title: string;
  category: 'print' | 'dibond' | 'acrylic' | 'digital';
  productType: 'Physical Fine Art Print' | 'Aluminium Dibond' | 'Acrylic Glass Mount' | 'Signed Digital Collector File';
  description: string;
  basePrice: number;
  sizes: ProductSizeOption[];
  framingOptions: ProductFramingOption[];
  certificateIncluded: boolean;
  inStock: boolean;
  shippingInfo: string;
}

export interface CartItem {
  id: string; // unique item id in cart
  productId: string;
  artworkId: string;
  title: string;
  imageUrl: string;
  sizeName: string;
  sizeDimensions: string;
  framingName: string;
  unitPrice: number;
  quantity: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  type: 'acquisition' | 'exhibition' | 'press' | 'commission' | 'general';
  subject: string;
  message: string;
  artworkReference?: string;
  status: 'new' | 'reviewed' | 'responded' | 'archived';
  createdAt: string;
}

export interface CollectorOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  phone?: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  notes?: string;
  items: CartItem[];
  totalAmount: number;
  currency: 'EUR';
  status: 'inquiry_reserved';
  createdAt: string;
}

export interface ExhibitionItem {
  year: number;
  title: string;
  venue: string;
  type: string;
}

export interface MonographItem {
  title: string;
  publisher: string;
  year: number;
  pages: string;
  isbn: string;
}

export interface ArtistProfile {
  name: string;
  title: string;
  location: string;
  biography: string[];
  exhibitions: ExhibitionItem[];
  monographs: MonographItem[];
  contact: {
    studioEmail: string;
    pressEmail: string;
    galleryRepresentation: string;
    studioAddress: string;
    phonePlaceholder: string;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  date: string;
  category: 'Kreativprozess' | 'Schulprojekt' | 'Fotografie' | 'Gedanken' | 'Ausstellung';
  imageUrl: string;
  readTime: string;
  tags: string[];
  published: boolean;
}

export type PresetThemeId =
  | 'alabaster'
  | 'pure_white'
  | 'sandstone'
  | 'warm_champagne'
  | 'nordic_slate'
  | 'obsidian_darkroom'
  | 'royal_gold'
  | 'emerald_studio'
  | 'cyber_neon'
  | 'bauhaus_blue'
  | 'terracotta'
  | 'custom';

export interface GalleryTheme {
  id: PresetThemeId;
  name: string;
  bgCanvas: string;
  bgSurface: string;
  bgSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderColor: string;
  accentColor: string;
  accentContrast: string;
  isDark: boolean;
}

