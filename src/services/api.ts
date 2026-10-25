import { Artwork, ShopProduct, ContactInquiry, CollectorOrder, GalleryTheme, ArtistProfile } from '../types';
import { initialArtworks, initialShopProducts, initialArtistProfile } from '../data/initialData';
import { defaultTheme } from '../data/themes';

const TOKEN_KEY = 'nab_gallery_admin_token';

export const getStoredAdminToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setStoredAdminToken = (token: string | null) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // ignore
  }
};

const getHeaders = (token?: string | null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const activeToken = token || getStoredAdminToken();
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
};

// --- ARTWORKS API ---

export async function fetchArtworks(): Promise<Artwork[]> {
  try {
    const res = await fetch('/api/artworks');
    if (!res.ok) throw new Error('Failed to fetch artworks from server');
    return await res.json();
  } catch (err) {
    console.warn('API fetchArtworks fallback to cached/initial data', err);
    return initialArtworks.filter(a => a.published);
  }
}

export async function fetchAllArtworksAdmin(): Promise<Artwork[]> {
  try {
    const res = await fetch('/api/artworks/all', {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized or failed to fetch artworks');
    return await res.json();
  } catch (err) {
    console.warn('API fetchAllArtworksAdmin fallback', err);
    return initialArtworks;
  }
}

export async function createArtwork(artwork: Partial<Artwork>): Promise<Artwork> {
  const res = await fetch('/api/artworks', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(artwork),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create artwork');
  }
  return await res.json();
}

export async function updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork> {
  const res = await fetch(`/api/artworks/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update artwork');
  }
  return await res.json();
}

export async function deleteArtwork(id: string): Promise<void> {
  const res = await fetch(`/api/artworks/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete artwork');
  }
}

export async function reorderArtworks(ids: string[]): Promise<void> {
  const res = await fetch('/api/artworks/reorder', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error('Failed to reorder artworks');
}

// --- SHOP API ---

export async function fetchProducts(): Promise<ShopProduct[]> {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.warn('API fetchProducts fallback', err);
    return initialShopProducts;
  }
}

export async function updateProduct(id: string, updates: Partial<ShopProduct>): Promise<ShopProduct> {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update product');
  return await res.json();
}

export async function checkoutCollectorInquiry(orderData: any): Promise<{ success: boolean; order: CollectorOrder; message: string }> {
  const res = await fetch('/api/shop/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Acquisition reservation failed');
  }
  return await res.json();
}

// --- CONTACT & INQUIRIES API ---

export async function submitContactInquiry(inquiry: {
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  artworkReference?: string;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Message delivery failed');
  }
  return await res.json();
}

export async function fetchInquiries(): Promise<ContactInquiry[]> {
  const res = await fetch('/api/inquiries', {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch inquiries');
  return await res.json();
}

export async function updateInquiryStatus(id: string, status: ContactInquiry['status']): Promise<ContactInquiry> {
  const res = await fetch(`/api/inquiries/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update inquiry');
  return await res.json();
}

// --- ADMIN AUTH ---

export async function loginAdmin(passkey: string): Promise<{ success: boolean; token: string }> {
  const res = await fetch('/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passkey }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Authentication rejected');
  }
  const result = await res.json();
  setStoredAdminToken(result.token);
  return result;
}

export async function resetDatabaseToSeeds(): Promise<void> {
  const res = await fetch('/api/reset', {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error('Reset failed');
}

// --- THEME & WEBSITE COLOURS API ---

export async function fetchTheme(): Promise<GalleryTheme> {
  try {
    const res = await fetch('/api/theme');
    if (!res.ok) throw new Error('Failed to fetch theme');
    return await res.json();
  } catch (err) {
    console.warn('API fetchTheme fallback to default', err);
    return defaultTheme;
  }
}

export async function updateTheme(themeUpdates: Partial<GalleryTheme>): Promise<{ success: boolean; theme: GalleryTheme }> {
  const res = await fetch('/api/theme', {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(themeUpdates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update website theme');
  }
  return await res.json();
}

// --- ARTIST PROFILE API ---

export async function fetchProfile(): Promise<ArtistProfile> {
  try {
    const res = await fetch('/api/profile');
    if (!res.ok) throw new Error('Failed to fetch artist profile');
    return await res.json();
  } catch (err) {
    console.warn('API fetchProfile fallback', err);
    return initialArtistProfile;
  }
}

export async function updateProfile(profileUpdates: Partial<ArtistProfile>): Promise<{ success: boolean; profile: ArtistProfile }> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(profileUpdates),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to update artist profile');
  }
  return await res.json();
}
