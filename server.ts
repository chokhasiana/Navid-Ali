import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { initialArtworks, initialShopProducts, initialArtistProfile } from './src/data/initialData';
import { Artwork, ShopProduct, ContactInquiry, CollectorOrder, GalleryTheme, ArtistProfile } from './src/types';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export const defaultTheme: GalleryTheme = {
  id: 'alabaster',
  name: 'Alabaster Museum',
  bgCanvas: '#faf9f6',
  bgSurface: '#ffffff',
  bgSubtle: '#f4f2ee',
  textPrimary: '#1c1917',
  textSecondary: '#57534e',
  textMuted: '#78716c',
  borderColor: '#e5e3dc',
  accentColor: '#1c1917',
  accentContrast: '#faf9f6',
  isDark: false
};

interface DatabaseSchema {
  artworks: Artwork[];
  products: ShopProduct[];
  inquiries: ContactInquiry[];
  orders: CollectorOrder[];
  theme: GalleryTheme;
  profile: ArtistProfile;
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data.artworks) && Array.isArray(data.products)) {
        // Guarantee theme and profile exist
        data.theme = data.theme || defaultTheme;
        data.profile = data.profile || initialArtistProfile;
        data.orders = Array.isArray(data.orders) ? data.orders : [];
        data.inquiries = Array.isArray(data.inquiries) ? data.inquiries : [];
        return data as DatabaseSchema;
      }
    }
  } catch (err) {
    console.error('Error reading db.json, falling back to initial data', err);
  }

  const initialDb: DatabaseSchema = {
    artworks: initialArtworks,
    products: initialShopProducts,
    inquiries: [
      {
        id: "inq-demo-1",
        name: "Dr. Elena Rostova",
        email: "elena.rostova@kunsthalle-berlin.de",
        type: "exhibition",
        subject: "Curatorial Inquiry: Winter Exhibition 2026/27",
        message: "Dear Navid, we would be delighted to discuss presenting your 'Brutalist Coastlines' series as part of our upcoming architectural photography survey. Could we arrange a studio visit?",
        status: "new",
        artworkReference: "Monolith IV: Ocean Fog",
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    orders: [],
    theme: defaultTheme,
    profile: initialArtistProfile
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving db.json', err);
  }
}

let db = loadDatabase();

// Middleware
app.use(express.json({ limit: '25mb' }));

// Admin authorization middleware - password protected with user requested password 164325
const ADMIN_SECRET = process.env.ADMIN_SECRET || '164325';

const verifyAdmin = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (token === ADMIN_SECRET) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Invalid administrative credentials.' });
};

// --- ARTWORKS API ---

// Public list: only published works, sorted by sortOrder
app.get('/api/artworks', (_req: Request, res: Response) => {
  const published = db.artworks
    .filter(a => a.published)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  res.json(published);
});

// Admin list: all works
app.get('/api/artworks/all', verifyAdmin, (_req: Request, res: Response) => {
  res.json(db.artworks.sort((a, b) => a.sortOrder - b.sortOrder));
});

// Single artwork
app.get('/api/artworks/:id', (req: Request, res: Response) => {
  const artwork = db.artworks.find(a => a.id === req.params.id);
  if (!artwork) {
    return res.status(404).json({ error: 'Artwork not found' });
  }
  res.json(artwork);
});

// Create artwork
app.post('/api/artworks', verifyAdmin, (req: Request, res: Response) => {
  const body = req.body as Partial<Artwork>;
  if (!body.title || !body.imageUrl) {
    return res.status(400).json({ error: 'Title and image are required.' });
  }

  const newArtwork: Artwork = {
    id: body.id || `art-${Date.now()}`,
    title: body.title,
    series: body.series || 'Unassigned Series',
    year: body.year || new Date().getFullYear(),
    category: body.category || 'monochrome',
    medium: body.medium || 'Archival Pigment Print',
    dimensions: body.dimensions || '120 × 80 cm',
    edition: body.edition || 'Limited Edition of 5',
    availableEditions: Number(body.availableEditions) || 1,
    price: Number(body.price) || 2500,
    currency: 'EUR',
    description: body.description || '',
    curatorialNotes: body.curatorialNotes || '',
    technicalDetails: body.technicalDetails || {
      cameraOrEngine: 'Medium Format System',
      lensOrAlgorithm: 'Standard Lens',
      captureYear: body.year || new Date().getFullYear(),
      fileSpec: '16-bit Master File'
    },
    imageUrl: body.imageUrl,
    artStyle: body.artStyle || 'Contemporary Fine Art',
    aspectRatio: body.aspectRatio || '16:9',
    featured: Boolean(body.featured),
    published: body.published !== undefined ? Boolean(body.published) : true,
    sortOrder: db.artworks.length + 1,
    exhibitions: Array.isArray(body.exhibitions) ? body.exhibitions : [],
    awards: Array.isArray(body.awards) ? body.awards : []
  };

  db.artworks.push(newArtwork);
  saveDatabase(db);
  res.status(201).json(newArtwork);
});

// Update artwork
app.put('/api/artworks/:id', verifyAdmin, (req: Request, res: Response) => {
  const index = db.artworks.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Artwork not found.' });
  }

  const updated: Artwork = {
    ...db.artworks[index],
    ...req.body,
    id: db.artworks[index].id // preserve ID
  };

  db.artworks[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

// Delete artwork
app.delete('/api/artworks/:id', verifyAdmin, (req: Request, res: Response) => {
  const initialLength = db.artworks.length;
  db.artworks = db.artworks.filter(a => a.id !== req.params.id);
  if (db.artworks.length === initialLength) {
    return res.status(404).json({ error: 'Artwork not found.' });
  }
  saveDatabase(db);
  res.json({ success: true, message: 'Artwork removed.' });
});

// Reorder artworks
app.post('/api/artworks/reorder', verifyAdmin, (req: Request, res: Response) => {
  const { ids } = req.body as { ids: string[] };
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: 'Array of ids required.' });
  }

  const orderedArtworks: Artwork[] = [];
  ids.forEach((id, idx) => {
    const item = db.artworks.find(a => a.id === id);
    if (item) {
      item.sortOrder = idx + 1;
      orderedArtworks.push(item);
    }
  });

  // Append any artworks not present in the order list
  db.artworks.forEach(a => {
    if (!ids.includes(a.id)) {
      a.sortOrder = orderedArtworks.length + 1;
      orderedArtworks.push(a);
    }
  });

  db.artworks = orderedArtworks;
  saveDatabase(db);
  res.json({ success: true, artworks: db.artworks });
});

// --- SHOP PRODUCTS API ---

app.get('/api/products', (_req: Request, res: Response) => {
  res.json(db.products);
});

app.put('/api/products/:id', verifyAdmin, (req: Request, res: Response) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  db.products[index] = {
    ...db.products[index],
    ...req.body,
    id: db.products[index].id
  };
  saveDatabase(db);
  res.json(db.products[index]);
});

// Collector order / inquiry checkout
app.post('/api/shop/checkout', (req: Request, res: Response) => {
  const { customerName, customerEmail, phone, shippingAddress, items, totalAmount, notes } = req.body;

  if (!customerName || !customerEmail || !items || !items.length) {
    return res.status(400).json({ error: 'Name, email and order items are required.' });
  }

  const orderNumber = `KV-${Date.now().toString().slice(-6)}`;
  const newOrder: CollectorOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    customerName,
    customerEmail,
    phone,
    shippingAddress: shippingAddress || { street: '', city: '', postalCode: '', country: 'Germany' },
    notes,
    items,
    totalAmount,
    currency: 'EUR',
    status: 'inquiry_reserved',
    createdAt: new Date().toISOString()
  };

  db.orders.push(newOrder);

  // Also create a linked gallery inquiry so artist sees it immediately
  const inquiryMessage = `Collector Acquisition Reservation #${orderNumber}\n\nItems Reserved:\n${items.map((i: any) => `- ${i.title} (${i.sizeName}, ${i.framingName}) × ${i.quantity}: €${(i.unitPrice * i.quantity).toLocaleString()}`).join('\n')}\n\nTotal: €${totalAmount.toLocaleString()}\nShipping Address: ${shippingAddress?.street}, ${shippingAddress?.postalCode} ${shippingAddress?.city}, ${shippingAddress?.country}\nNotes: ${notes || 'None'}`;

  db.inquiries.push({
    id: `inq-order-${Date.now()}`,
    name: customerName,
    email: customerEmail,
    type: 'acquisition',
    subject: `Acquisition Reservation #${orderNumber}`,
    message: inquiryMessage,
    status: 'new',
    createdAt: new Date().toISOString()
  });

  saveDatabase(db);

  res.status(201).json({
    success: true,
    order: newOrder,
    message: 'Your collector acquisition reservation has been registered. The gallery registrar will contact you with the formal invoice and crating schedule.'
  });
});

// --- CONTACT INQUIRIES API ---

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, type, subject, message, artworkReference } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const newInquiry: ContactInquiry = {
    id: `inq-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    type: type || 'general',
    subject: subject?.trim() || 'General Inquiry',
    message: message.trim(),
    artworkReference: artworkReference || undefined,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  db.inquiries.unshift(newInquiry);
  saveDatabase(db);

  res.status(201).json({
    success: true,
    inquiry: newInquiry,
    message: 'Thank you. Your message has been transmitted directly to Navid Ali Bhatti Studio. We respond to all collector and curatorial inquiries within 24 hours.'
  });
});

app.get('/api/inquiries', verifyAdmin, (_req: Request, res: Response) => {
  res.json(db.inquiries);
});

app.put('/api/inquiries/:id', verifyAdmin, (req: Request, res: Response) => {
  const index = db.inquiries.findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Inquiry not found.' });
  }
  db.inquiries[index] = {
    ...db.inquiries[index],
    ...req.body,
    id: db.inquiries[index].id
  };
  saveDatabase(db);
  res.json(db.inquiries[index]);
});

// --- THEME & WEBSITE COLOURS API ---

app.get('/api/theme', (_req: Request, res: Response) => {
  res.json(db.theme || defaultTheme);
});

app.put('/api/theme', verifyAdmin, (req: Request, res: Response) => {
  const newTheme = req.body as Partial<GalleryTheme>;
  if (!newTheme || !newTheme.bgCanvas || !newTheme.textPrimary) {
    return res.status(400).json({ error: 'Valid theme object is required.' });
  }

  db.theme = {
    ...defaultTheme,
    ...db.theme,
    ...newTheme
  };
  saveDatabase(db);
  res.json({ success: true, theme: db.theme, message: 'Website theme and colors updated.' });
});

// --- ARTIST PROFILE API ---

app.get('/api/profile', (_req: Request, res: Response) => {
  res.json(db.profile || initialArtistProfile);
});

app.put('/api/profile', verifyAdmin, (req: Request, res: Response) => {
  const newProfile = req.body as Partial<ArtistProfile>;
  if (!newProfile || !newProfile.name) {
    return res.status(400).json({ error: 'Profile name is required.' });
  }

  db.profile = {
    ...initialArtistProfile,
    ...db.profile,
    ...newProfile
  };
  saveDatabase(db);
  res.json({ success: true, profile: db.profile, message: 'Artist profile updated.' });
});

// --- AUTH API ---

app.post('/api/admin/auth', (req: Request, res: Response) => {
  const { passkey } = req.body;
  if (passkey === ADMIN_SECRET) {
    return res.json({
      success: true,
      token: ADMIN_SECRET,
      role: 'artist_curator',
      name: 'Navid Ali Bhatti'
    });
  }
  return res.status(401).json({ error: 'Invalid master passkey. Please use the studio password.' });
});

// Reset data to pristine curated seeds
app.post('/api/reset', verifyAdmin, (_req: Request, res: Response) => {
  db = {
    artworks: initialArtworks,
    products: initialShopProducts,
    inquiries: [
      {
        id: "inq-demo-1",
        name: "Dr. Elena Rostova",
        email: "elena.rostova@kunsthalle-berlin.de",
        type: "exhibition",
        subject: "Curatorial Inquiry: Winter Exhibition 2026/27",
        message: "Dear Navid, we would be delighted to discuss presenting your 'Brutalist Coastlines' series as part of our upcoming architectural photography survey. Could we arrange a studio visit?",
        status: "new",
        artworkReference: "Monolith IV: Ocean Fog",
        createdAt: new Date().toISOString()
      }
    ],
    orders: [],
    theme: defaultTheme,
    profile: initialArtistProfile
  };
  saveDatabase(db);
  res.json({ success: true, message: 'Database reset to original curatorial master state.' });
});

// --- FRONTEND INTEGRATION ---

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Gallery Server] Studio gallery operational on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start gallery server:', err);
});
