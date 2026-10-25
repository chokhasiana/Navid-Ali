import { Artwork, ShopProduct, ArtistProfile, BlogPost } from '../types';

export const initialArtistProfile: ArtistProfile = {
  name: "Navid Ali Bhatti",
  title: "Schüler-Portfolio, Bildende Kunst & Kreativ-Blog",
  location: "Berlin / Zürich",
  biography: [
    "Navid Ali Bhatti ist Schüler und junger bildender Künstler aus Berlin. Dieses private Portfolio und persönlicher Blog dokumentiert seine kreativen Arbeiten – von analoger Mittelformat- und Architekturfotografie über Skizzenbücher bis hin zu generativen Lichtexperimenten und schulischen Kunstprojekten.",
    "Seine Praxis konzentriert sich auf geometrische Ruhe, monumentale Schatten und die Erforschung des Raumes. Jedes Werk entsteht im eigenen Schulatelier und Dunkelkammer-Labor, oft in Verbindung mit digitalem Code und handgebundenen Skizzenbüchern.",
    "In diesem Blog teilt Navid persönliche Einblicke in seinen gestalterischen Lernprozess, Experimente mit neuen Techniken, Prüfungsvorbereitungen für den Leistungskurs Kunst sowie Gedanken zu zeitgenössischer Architektur und Ästhetik."
  ],
  exhibitions: [
    { year: 2026, title: "Resonance in Concrete & Code", venue: "Neue Nationalgalerie Project Space, Berlin", type: "Solo Exhibition" },
    { year: 2025, title: "Luminance / Dark Ecology", venue: "Kunstraum Tokyo, Roppongi", type: "Curated Showcase" },
    { year: 2024, title: "Biennial of Media Arts", venue: "Arsenale Docks, Venice", type: "Selected Installation" },
    { year: 2023, title: "Monuments of Solitude", venue: "Center for Photographic Arts, Zürich", type: "Solo Exhibition" },
    { year: 2022, title: "Silent Matter / Algorithmic Voids", venue: "Institute of Contemporary Arts, London", type: "Group Exhibition" }
  ],
  monographs: [
    { title: "The Geometry of Silence", publisher: "Hatje Cantz Berlin", year: 2024, pages: "248 pages, 140 tritone plates", isbn: "978-3-7757-5421-9" },
    { title: "Fragments of the Void", publisher: "Kehrer Verlag Heidelberg", year: 2021, pages: "180 pages, duotone archival paper", isbn: "978-3-86828-984-2" }
  ],
  contact: {
    studioEmail: "studio@navidalibhatti.art",
    pressEmail: "press@navidalibhatti.art",
    galleryRepresentation: "Galerie Nordenfalk (Berlin / Stockholm)",
    studioAddress: "Studio Navid Ali Bhatti, Köpenicker Str. 124, 10179 Berlin, Germany",
    phonePlaceholder: "+49 (0) 30 8920 4410"
  }
};

export const initialArtworks: Artwork[] = [
  {
    id: "art-monolith-01",
    title: "Monolith IV: Ocean Fog",
    series: "Brutalist Coastlines",
    year: 2025,
    category: "monochrome",
    medium: "Archival Carbon Pigment on Hahnemühle Photo Rag 308g",
    dimensions: "180 × 120 cm / 70.8 × 47.2 in",
    edition: "Limited Edition of 5 + 2 AP",
    availableEditions: 2,
    price: 4800,
    currency: "EUR",
    description: "An isolated monolithic concrete sea pavilion emerging through thick Atlantic sea smoke at dawn. Captured with an 8x10 large format field camera over a continuous 14-minute exposure.",
    curatorialNotes: "In 'Monolith IV', the brutalist mass dissolves into oceanic haze, transforming heavy cast concrete into an ethereal ghost of modernist ambition.",
    technicalDetails: {
      cameraOrEngine: "Deardorff 8x10 Field Camera / Schneider Kreuznach 300mm",
      lensOrAlgorithm: "Ilford HP5 Plus (developed in Rodinal 1+50)",
      captureYear: 2025,
      fileSpec: "Drum scan 16-bit TIFF / 24,000 × 16,000 px"
    },
    imageUrl: "/art/monolith_fog.svg",
    artStyle: "Architectural Fine Art Photography",
    aspectRatio: "16:9",
    featured: true,
    published: true,
    sortOrder: 1,
    exhibitions: ["Neue Nationalgalerie Project Space, Berlin (2026)", "Center for Photographic Arts Zürich (2025)"],
    awards: ["International Fine Art Photography Monograph Gold, 2025"]
  },
  {
    id: "art-chroma-02",
    title: "Quantum Chromodynamics III: Indigo Rift",
    series: "Synthetic Fields",
    year: 2026,
    category: "generative",
    medium: "Direct UV-Curable Print on Brushed Aluminium Dibond, Matt Finish",
    dimensions: "160 × 120 cm / 63 × 47.2 in",
    edition: "Limited Edition of 7 + 1 AP",
    availableEditions: 3,
    price: 3900,
    currency: "EUR",
    description: "A computational synthesis of quantum field fluctuations rendered as continuous topological light manifolds. The dark void background contrasts with ribbons of cobalt, deep indigo, and icy titanium.",
    curatorialNotes: "Generated through custom C++ simulation shaders that calculate the interaction between light waves and virtual magnetic fluxes across multi-dimensional manifolds.",
    technicalDetails: {
      cameraOrEngine: "Bespoke C++ / Metal Fluid Dynamic Shaders",
      lensOrAlgorithm: "Raymarched Navier-Stokes Volumetric Solver",
      captureYear: 2026,
      fileSpec: "Procedural vector resolution / 16K Master Master"
    },
    imageUrl: "/art/chroma_void.svg",
    artStyle: "Algorithmic Digital Art",
    aspectRatio: "4:3",
    featured: true,
    published: true,
    sortOrder: 2,
    exhibitions: ["Biennial of Media Arts Venice (2024)", "Kunstraum Tokyo (2025)"],
    awards: ["Lumen Prize Nominee for Pure Computational Art, 2025"]
  },
  {
    id: "art-solitude-03",
    title: "Basalt Tower in Arctic Twilight",
    series: "Silent Coastlines",
    year: 2024,
    category: "monochrome",
    medium: "Platinum-Palladium Print on Hand-Coated Japanese Washi Paper",
    dimensions: "120 × 90 cm / 47.2 × 35.4 in",
    edition: "Limited Edition of 3 + 1 AP",
    availableEditions: 1,
    price: 6200,
    currency: "EUR",
    description: "A single volcanic basalt needle rising sheer from the North Atlantic surf off the Vik coast during polar night, reflecting faint silver ambient twilight on glassy water.",
    curatorialNotes: "Hand-printed by the artist in his Berlin darkroom using precious platinum and palladium salts, achieving rich luminous midtones impossible in standard silver processes.",
    technicalDetails: {
      cameraOrEngine: "Linhof Master Technika 4x5 / Rodenstock Grandagon 90mm",
      lensOrAlgorithm: "Kodak Tri-X 320 Sheet Film",
      captureYear: 2024,
      fileSpec: "Contact printed directly from 4x5 sheet negative"
    },
    imageUrl: "/art/basalt_stack.svg",
    artStyle: "Fine Art Landscape Photography",
    aspectRatio: "3:4",
    featured: true,
    published: true,
    sortOrder: 3,
    exhibitions: ["Arsenale Docks Venice (2024)", "Hatje Cantz Retrospective (2024)"],
    awards: ["European Landscape Master Print Selection 2024"]
  },
  {
    id: "art-fractal-04",
    title: "Algorithmic Flora IX: Filament Lattice",
    series: "Synthetic Botany",
    year: 2025,
    category: "generative",
    medium: "Face-Mounted Museum Acrylic Glass on Diasec Aluminium Substrate",
    dimensions: "140 × 105 cm / 55.1 × 41.3 in",
    edition: "Limited Edition of 5 + 2 AP",
    availableEditions: 4,
    price: 4400,
    currency: "EUR",
    description: "Intricate recursive crystalline geometries emulating the vascular architecture of deep-sea bioluminescent organisms suspended in an obsidian vacuum.",
    curatorialNotes: "Explores the philosophical boundary between organic growth and deterministic computation, presenting mathematically generated organisms that feel undeniably alive.",
    technicalDetails: {
      cameraOrEngine: "Recursive Differential Growth Algorithm in Rust",
      lensOrAlgorithm: "Octree-Accelerated Path Tracing Engine",
      captureYear: 2025,
      fileSpec: "32-bit floating point EXR render / 12,000 × 9,000 px"
    },
    imageUrl: "/art/algorithmic_flora.svg",
    artStyle: "Generative Spatial Media",
    aspectRatio: "4:3",
    featured: true,
    published: true,
    sortOrder: 4,
    exhibitions: ["Institute of Contemporary Arts London (2022)", "Kunstraum Tokyo (2025)"],
    awards: []
  },
  {
    id: "art-arch-05",
    title: "Cantilever in Rain, Berlin V",
    series: "Brutalist Coastlines",
    year: 2023,
    category: "architectural",
    medium: "Archival Pigment on Hahnemühle FineArt Baryta 325g",
    dimensions: "150 × 100 cm / 59 × 39.4 in",
    edition: "Limited Edition of 10 + 2 AP",
    availableEditions: 5,
    price: 3200,
    currency: "EUR",
    description: "A study of reinforced concrete brutalism in deep Berlin rain. The wet surface reflects street sodium light, turning planar concrete into a mirror of urban solitude.",
    curatorialNotes: "A masterwork of geometric framing, balancing heavy horizontal cantilevers against delicate vertical streaks of rain.",
    technicalDetails: {
      cameraOrEngine: "Leica S3 Medium Format / Summarit-S 70mm f/2.5 ASPH",
      lensOrAlgorithm: "ISO 100, f/11, 2.5s exposure on Gitzo carbon tripod",
      captureYear: 2023,
      fileSpec: "64 Megapixel Medium Format DNG"
    },
    imageUrl: "/art/cantilever_rain.svg",
    artStyle: "Architectural Photography",
    aspectRatio: "16:9",
    featured: false,
    published: true,
    sortOrder: 5,
    exhibitions: ["Center for Photographic Arts Zürich (2023)"],
    awards: []
  },
  {
    id: "art-void-06",
    title: "Event Horizon: Zero Point",
    series: "Synthetic Fields",
    year: 2026,
    category: "conceptual",
    medium: "Ultra-Matte Archival Carbon Print in Custom Steel Shadowbox Frame",
    dimensions: "130 × 130 cm / 51.2 × 51.2 in",
    edition: "Limited Edition of 3 + 1 AP",
    availableEditions: 1,
    price: 5900,
    currency: "EUR",
    description: "An exploration of absolute blackness and the minimal threshold of visible light. The composition features a singularity ring rendered at the limit of human perception.",
    curatorialNotes: "When viewed in controlled gallery lighting, the artwork creates the optical illusion of physical depth receding infinitely past the wall surface.",
    technicalDetails: {
      cameraOrEngine: "Custom General Relativity Gravitational Lensing Code",
      lensOrAlgorithm: "Spectral Light Raymarcher",
      captureYear: 2026,
      fileSpec: "Spectrally sampled 16-channel luminance map"
    },
    imageUrl: "/art/event_horizon.svg",
    artStyle: "Conceptual Digital Art",
    aspectRatio: "1:1",
    featured: true,
    published: true,
    sortOrder: 6,
    exhibitions: ["Neue Nationalgalerie Project Space, Berlin (2026)"],
    awards: []
  }
];

export const initialShopProducts: ShopProduct[] = [
  {
    id: "prod-print-01",
    artworkId: "art-monolith-01",
    title: "Monolith IV: Ocean Fog — Archival Museum Print",
    category: "print",
    productType: "Physical Fine Art Print",
    description: "Master printer certified archival pigment print on heavy 308g Hahnemühle Photo Rag cotton paper. Hand-signed and numbered by Navid Ali Bhatti in pencil on the margin. Includes an embossed Certificate of Authenticity with registered hologram.",
    basePrice: 1200,
    sizes: [
      { name: "Collector Medium", dimensions: "90 × 60 cm (35.4 × 23.6 in)", price: 1200, available: true },
      { name: "Gallery Large", dimensions: "140 × 93 cm (55.1 × 36.6 in)", price: 2400, available: true },
      { name: "Monographic Monument", dimensions: "180 × 120 cm (70.8 × 47.2 in)", price: 4800, available: true }
    ],
    framingOptions: [
      { name: "Unframed (Rolled in Archival Tube)", surcharge: 0 },
      { name: "Museum Shadowbox Frame (Black Stained Oak with Museum Anti-Reflective Glass)", surcharge: 480 },
      { name: "Minimalist Floating Aluminium Frame (Deep Slate)", surcharge: 390 }
    ],
    certificateIncluded: true,
    inStock: true,
    shippingInfo: "Complimentary insured worldwide courier shipping with temperature-controlled art crating for framed editions. Estimated delivery: 10–14 business days."
  },
  {
    id: "prod-dibond-02",
    artworkId: "art-chroma-02",
    title: "Quantum Chromodynamics III — Brushed Aluminium Dibond",
    category: "dibond",
    productType: "Aluminium Dibond",
    description: "Direct gallery UV print onto real brushed aluminium dibond backing. The metallic substrate subtly glistens through the lighter titanium highlights while blacks remain absolute, creating stunning luminosity under spot lighting.",
    basePrice: 1850,
    sizes: [
      { name: "Gallery Standard", dimensions: "100 × 75 cm (39.4 × 29.5 in)", price: 1850, available: true },
      { name: "Exhibition Statement", dimensions: "160 × 120 cm (63 × 47.2 in)", price: 3900, available: true }
    ],
    framingOptions: [
      { name: "Integrated Invisible Floating Wall Mount (15mm Wall Standoff)", surcharge: 0 },
      { name: "Slimline Anodized Black Aluminium Floating Tray", surcharge: 320 }
    ],
    certificateIncluded: true,
    inStock: true,
    shippingInfo: "Shipped in custom wooden crate with reinforced edge protectors. Ready to hang upon unboxing."
  },
  {
    id: "prod-acrylic-04",
    artworkId: "art-fractal-04",
    title: "Algorithmic Flora IX — Diasec Acrylic Glass Mount",
    category: "acrylic",
    productType: "Acrylic Glass Mount",
    description: "Genuine Diasec museum-grade process: face-mounting the photographic print beneath 4mm polished optical-grade acrylic glass, backed with 3mm aluminium. Delivers extraordinary depth, chromatic saturation, and 99% UV preservation.",
    basePrice: 2200,
    sizes: [
      { name: "Square Collector", dimensions: "90 × 67.5 cm (35.4 × 26.5 in)", price: 2200, available: true },
      { name: "Monumental Diasec", dimensions: "140 × 105 cm (55.1 × 41.3 in)", price: 4400, available: true }
    ],
    framingOptions: [
      { name: "Hidden Aluminium Subframe (Floating Illusion)", surcharge: 0 },
      { name: "Solid Smoked Walnut Shadow Gap Frame", surcharge: 550 }
    ],
    certificateIncluded: true,
    inStock: true,
    shippingInfo: "Insured white-glove art courier delivery throughout Europe and North America."
  },
  {
    id: "prod-monograph-book",
    artworkId: "art-monolith-01",
    title: "Monograph: The Geometry of Silence (Special Collector Edition)",
    category: "print",
    productType: "Physical Fine Art Print",
    description: "Hardcover monograph published by Hatje Cantz (Berlin). 248 pages with 140 tritone plates on Japanese Fedrigoni paper. Limited Collector Edition of 300 copies, presented in an embossed linen slipcase, accompanied by an original signed 24 × 18 cm silver gelatin photograph.",
    basePrice: 280,
    sizes: [
      { name: "Collector Book Edition + Signed Original Print", dimensions: "32 × 28 cm (Hardcover with Slipcase)", price: 280, available: true }
    ],
    framingOptions: [
      { name: "Standard Book in Slipcase", surcharge: 0 }
    ],
    certificateIncluded: true,
    inStock: true,
    shippingInfo: "Dispatched within 48 hours via registered postal courier."
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: "post-01",
    title: "Vom Skizzenbuch zur Serie: Warum der Leerraum der wichtigste Teil des Bildes ist",
    slug: "vom-skizzenbuch-zur-serie-leerraum",
    summary: "Ein Einblick in meine Vorbereitung für die Kunst-Facharbeit. Wie ich mit minimalistischen Kompositionen und negativer Fläche arbeite, um Bildtiefe zu erzeugen.",
    content: "In der Schule wird uns oft beigebracht, ein Blatt möglichst ausgewogen 'auszufüllen'. Doch in meinen eigenen Arbeiten – besonders bei den brutalistischen Monolithen – habe ich gemerkt: Das Auge braucht Stille. Wenn 80 % der Bildfläche aus Nebel, Wolken oder tiefschwarzem Himmel bestehen, wird das winzige Betonelement im Zentrum plötzlich monumental. Für diesen Blogbeitrag habe ich Auszüge aus meinem handgebundenen Skizzenbuch fotografiert und zeige den Entwicklungsprozess von der ersten Bleistiftstudie bis zum fertigen Pigmentdruck.",
    date: "24. Oktober 2026",
    category: "Kreativprozess",
    imageUrl: "/art/monolith_fog.svg",
    readTime: "4 Min. Lesezeit",
    tags: ["Skizzenbuch", "Minimalismus", "Komposition", "Schulatelier"],
    published: true,
  },
  {
    id: "post-02",
    title: "Analoges Mittelformat vs. Generativer Code: Mein Schulprojekt im Kunst-Leistungskurs",
    slug: "analoges-mittelformat-vs-generativer-code",
    summary: "Für meine Semesteraufgabe habe ich klassische Ilford HP5-Filme mit p5.js-Algorithmen kombiniert. Hier ist der Bericht über Fehlschläge und Durchbrüche.",
    content: "Kann ein Computerprogramm dieselbe Seele besitzen wie ein Filmstreifen, der in der Dunkelkammer in Entwicklerflüssigkeit schwimmt? Genau diese Frage wollte ich in meinem Abschlussprojekt beantworten. Ich habe analoge Negative mit hohem Korn eingescannt und durch einen eigens geschriebenen Algorithmus geschickt, der die Lichtintensität in topografische Höhenlinien übersetzt. Das Resultat war überraschend: Die Körnigkeit des analogen Films erzeugt im digitalen Code organische Fehler ('Glitch-Muster'), die kein KI-Modell so vorhersagen konnte.",
    date: "12. Oktober 2026",
    category: "Schulprojekt",
    imageUrl: "/art/chroma_void.svg",
    readTime: "6 Min. Lesezeit",
    tags: ["Kunstunterricht", "Dunkelkammer", "Algorithmen", "Experiment"],
    published: true,
  },
  {
    id: "post-03",
    title: "Erste Schritte im Dunkelkammer-Labor: Chemikalien, Lichtfallen und Geduld",
    slug: "erste-schritte-dunkelkammer-labor",
    summary: "Ein Erfahrungsbericht über den Aufbau meines kleinen Arbeitsplatzes und die Faszination, wenn im roten Licht plötzlich die Konturen auf dem Fotopapier sichtbar werden.",
    content: "Geduld ist etwas, das uns im Smartphone-Zeitalter völlig abhandengekommen ist. Wenn ich ein Foto auf dem Handy mache, sehe ich es in 0,1 Sekunden. In der Dunkelkammer dauert es 15 Minuten, bis man überhaupt weiß, ob die Belichtungszeit gestimmt hat. Dieser Prozess zwingt mich als Schüler dazu, vor dem Auslösen dreimal nachzudenken: Stimmt die Geometrie? Ist der Fluchtpunkt sauber ausgerichtet? Hier teile ich meine bevorzugten Entwickler-Rezepte und Tipps für alle, die selbst analog anfangen möchten.",
    date: "28. September 2026",
    category: "Fotografie",
    imageUrl: "/art/basalt_stack.svg",
    readTime: "5 Min. Lesezeit",
    tags: ["Dunkelkammer", "Schwarzweiß", "Handwerk", "Inspiration"],
    published: true,
  },
  {
    id: "post-04",
    title: "Gedanken zu Architektur & Raum: Berlins verborgene brutalistische Ikonen",
    slug: "berlins-verborgene-brutalistische-ikonen",
    summary: "Auf Fototour durch Berlin: Warum Betonbauten aus den 70er Jahren mich mehr inspirieren als glänzende Glasfassaden.",
    content: "An Wochenenden fahre ich oft mit der S-Bahn an die Außenbezirke von Berlin. Dort stehen die oft geschmähten Betonbauten: Kirchen, Gemeindezentren, Universitätsinstitute. Viele Menschen finden sie abweisend und kalt. Für mich sind sie wie moderne Skulpturen. Das Licht bricht sich auf dem rauen Sichtbeton wie an einer Felswand. In dieser Notiz dokumentiere ich drei Standorte, die ich für meine nächste Werkreihe fotografiert habe.",
    date: "15. September 2026",
    category: "Gedanken",
    imageUrl: "/art/cantilever_rain.svg",
    readTime: "3 Min. Lesezeit",
    tags: ["Berlin", "Brutalismus", "Architektur", "Inspiration"],
    published: true,
  }
];

