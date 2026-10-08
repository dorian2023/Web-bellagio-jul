/**
 * @file concierge-search.ts
 * @description High-performance semantic retrieval engine for Muebles Bellagio AI Concierge.
 * Dynamically resolves user intent, expands luxury materials/shapes synonyms, and retrieves
 * the top relevant candidate products in <10ms, scaling seamlessly from 200 to 2,000+ products.
 */

import { Product } from '@/src/types/catalog';

export interface SearchIntent {
  rawQuery: string;
  detectedCategory?: string;
  expandedKeywords: string[];
  requiresMadeToMeasure: boolean;
  shapeIntent?: string;
}

/**
 * Luxury materials and finishes synonym thesaurus
 */
const MATERIAL_SYNONYMS: Record<string, string[]> = {
  vidrio: ['vidrio', 'cristal', 'espejo', 'glitter', 'reflectante', 'templado'],
  cristal: ['cristal', 'vidrio', 'espejo', 'glitter', 'reflectante', 'templado'],
  espejo: ['espejo', 'vidrio', 'cristal', 'reflectante', 'glitter'],
  marmol: ['marmol', 'mármol', 'piedra sinterizada', 'porcelánico', 'mineral'],
  mármol: ['mármol', 'marmol', 'piedra sinterizada', 'porcelánico', 'mineral'],
  piedra: ['piedra sinterizada', 'piedra', 'mármol', 'porcelánico'],
  cuero: ['cuero', 'bipiel', 'semicuero', 'piel'],
  bipiel: ['bipiel', 'cuero', 'semicuero'],
  madera: ['madera', 'cedro', 'roble', 'maderas nobles', 'nogal', 'pino', 'acabados finos'],
  boucle: ['boucle', 'bouclé', 'tela', 'tapizado', 'textil'],
  bouclé: ['bouclé', 'boucle', 'tela', 'tapizado', 'textil'],
  lino: ['lino', 'tela', 'tapizado', 'textil'],
  terciopelo: ['terciopelo', 'velvet', 'tela', 'tapizado'],
  velvet: ['velvet', 'terciopelo', 'tela', 'tapizado'],
  metal: ['metal', 'metálica', 'acero', 'inoxidable', 'hierro', 'aluminio', 'dorado', 'cromo'],
  antifluido: ['antifluido', 'pet-friendly', 'pet friendly', 'antimanchas']
};

/**
 * Category aliases and synonyms for Muebles Bellagio catalog
 */
const CATEGORY_SYNONYMS: Record<string, string> = {
  'mesa de centro': 'mesas-de-centro',
  'mesas de centro': 'mesas-de-centro',
  'mesa centro': 'mesas-de-centro',
  'mesas centro': 'mesas-de-centro',
  'mesa de noche': 'mesas-de-noche',
  'mesas de noche': 'mesas-de-noche',
  'mesa noche': 'mesas-de-noche',
  'mesitas de noche': 'mesas-de-noche',
  'nochero': 'mesas-de-noche',
  'nocheros': 'mesas-de-noche',
  'comedor': 'comedores',
  'comedores': 'comedores',
  'mesa de comedor': 'comedores',
  'mesas de comedor': 'comedores',
  'dormitorio': 'dormitorios',
  'dormitorios': 'dormitorios',
  'cama': 'dormitorios',
  'camas': 'dormitorios',
  'cabecero': 'dormitorios',
  'cabeceros': 'dormitorios',
  'box spring': 'box-spring',
  'boxspring': 'box-spring',
  'ceibo': 'ceibos',
  'ceibos': 'ceibos',
  'aparador': 'ceibos',
  'buffet': 'ceibos',
  'closet': 'closet',
  'closets': 'closet',
  'armario': 'closet',
  'espejo': 'espejos',
  'espejos': 'espejos',
  'gavetero': 'gaveteros',
  'gaveteros': 'gaveteros',
  'comoda': 'gaveteros',
  'cómoda': 'gaveteros',
  'mesa tv': 'mesas-tv',
  'mesas tv': 'mesas-tv',
  'mueble tv': 'mesas-tv',
  'rack tv': 'mesas-tv',
  'peinadora': 'peinadoras',
  'peinadoras': 'peinadoras',
  'poltrona': 'poltronas',
  'poltronas': 'poltronas',
  'sillon': 'poltronas',
  'sillón': 'poltronas',
  'butaca': 'poltronas',
  'silla': 'sillas',
  'sillas': 'sillas',
  'sofacama': 'sofacamas',
  'sofacamas': 'sofacamas',
  'sofa cama': 'sofacamas',
  'sofá cama': 'sofacamas',
  'sofa': 'sofas',
  'sofas': 'sofas',
  'sofá': 'sofas',
  'sofás': 'sofas',
  'seccional': 'sofas',
  'modular': 'sofas',
  'esquinero': 'sofas',
  'chaise': 'sofas',
  'canapé': 'sofas',
  'taburete': 'taburete',
  'taburetes': 'taburete',
  'silla bar': 'taburete',
  'zapatera': 'zapateras',
  'zapateras': 'zapateras'
};

/**
 * Shape and geometry indicators
 */
const SHAPE_KEYWORDS: Record<string, string[]> = {
  circular: ['circular', 'redondo', 'redonda', 'diámetro', 'diametro'],
  rectangular: ['rectangular', 'rectangulo', 'rectángulo'],
  cuadrado: ['cuadrado', 'cuadrada'],
  modular: ['modular', 'esquinero', 'en l', 'canapé', 'chaise', 'chaselong']
};

/**
 * Normalizes text removing accents and non-alphanumeric noise
 */
function cleanText(text?: string | null): string {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Analyzes conversation text to extract high-intent search criteria
 */
export function extractSearchIntent(query: string): SearchIntent {
  const normalized = cleanText(query);
  const words = normalized.split(/\s+/).filter(w => w.length > 2);

  let detectedCategory: string | undefined;
  for (const [phrase, catId] of Object.entries(CATEGORY_SYNONYMS)) {
    if (normalized.includes(cleanText(phrase))) {
      detectedCategory = catId;
      break;
    }
  }

  let shapeIntent: string | undefined;
  for (const [shape, aliases] of Object.entries(SHAPE_KEYWORDS)) {
    if (aliases.some(alias => normalized.includes(cleanText(alias)))) {
      shapeIntent = shape;
      break;
    }
  }

  // Expand keywords with synonyms
  const expandedSet = new Set<string>();
  words.forEach(w => {
    expandedSet.add(w);
    // Check material synonyms
    for (const [baseMat, syns] of Object.entries(MATERIAL_SYNONYMS)) {
      if (cleanText(baseMat) === w || syns.some(s => cleanText(s) === w)) {
        syns.forEach(s => expandedSet.add(cleanText(s)));
      }
    }
  });

  const requiresMadeToMeasure =
    normalized.includes('medida') ||
    normalized.includes('personaliz') ||
    normalized.includes('taller') ||
    normalized.includes('fabric');

  return {
    rawQuery: query,
    detectedCategory,
    expandedKeywords: Array.from(expandedSet),
    requiresMadeToMeasure,
    shapeIntent
  };
}

/**
 * Scores a product against the user search intent
 */
function scoreProduct(product: Product, intent: SearchIntent): number {
  let score = 0;
  const pTitle = cleanText(product.title);
  const pDesc = cleanText(product.description || '');
  const pMats = cleanText(product.materials || '');
  const pDims = cleanText(product.dimensions || '');
  const pCat = cleanText(product.category || (product as any).category_id);
  const rawColors = product.availableColors || (product as any).available_colors || [];
  const pColors = Array.isArray(rawColors) ? rawColors.map(cleanText).join(' ') : cleanText(String(rawColors));

  const fullProductText = `${pTitle} ${pDesc} ${pMats} ${pDims} ${pCat} ${pColors}`;

  // 1. Direct title exact / partial match (Highest priority)
  for (const word of intent.expandedKeywords) {
    if (word.length >= 3 && pTitle.includes(word)) {
      score += 40;
      if (word === 'glitter' || word === 'granada' || word === 'susy') {
        score += 80;
      }
    }
  }

  // 2. Category matching
  if (intent.detectedCategory) {
    if (product.category === intent.detectedCategory) {
      score += 50;
    } else {
      // If query is specifically about a category, penalize others slightly
      score -= 15;
    }
  }

  // 3. Materials and Synonyms matching
  for (const word of intent.expandedKeywords) {
    if (word.length >= 3) {
      if (pMats.includes(word)) score += 25;
      if (pDesc.includes(word)) score += 15;
      if (fullProductText.includes(word)) score += 10;
    }
  }

  // 4. Shape matching
  if (intent.shapeIntent) {
    const shapeAliases = SHAPE_KEYWORDS[intent.shapeIntent] || [];
    const hasShape = shapeAliases.some(alias => fullProductText.includes(cleanText(alias)));
    if (hasShape) {
      score += 35;
    }
  }

  // 5. Stock and Origin preference
  if (product.stockStatus === 'disponible') {
    score += 5;
  }
  if (intent.requiresMadeToMeasure && product.origin === 'nacional') {
    score += 20;
  }

  return score;
}

/**
 * Dynamically retrieves the top N relevant candidate products from any catalog size (200 - 2,000+ items).
 * If the user's inquiry is broad, it provides a curated selection of flagship pieces across categories.
 */
export function retrieveDynamicCandidates(
  allProducts: Product[],
  userMessages: string[],
  limit = 15
): { candidates: Product[]; intent: SearchIntent } {
  // Combine the last 2 user messages for high-context intent extraction
  const recentUserText = userMessages.slice(-2).join(' ');
  const intent = extractSearchIntent(recentUserText);

  // Score all products
  const scored = allProducts.map(p => ({
    product: p,
    score: scoreProduct(p, intent)
  }));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Filter top matches with positive score
  const topMatches = scored.filter(item => item.score > 10).map(item => item.product);

  let finalCandidates: Product[] = [];

  if (topMatches.length >= 3) {
    finalCandidates = topMatches.slice(0, limit);
  } else {
    // If few or no direct matches (general greeting or broad exploration):
    // Take what matched, plus a curated sample of flagship pieces across major categories
    const selectedIds = new Set<string>(topMatches.map(p => p.id));
    finalCandidates = [...topMatches];

    const flagshipCategories = [
      'sofas',
      'comedores',
      'dormitorios',
      'mesas-de-centro',
      'poltronas',
      'sofacamas',
      'mesas-de-noche'
    ];

    for (const cat of flagshipCategories) {
      if (finalCandidates.length >= limit) break;
      const piece = allProducts.find(
        p => p.category === cat && p.stockStatus === 'disponible' && !selectedIds.has(p.id)
      );
      if (piece) {
        selectedIds.add(piece.id);
        finalCandidates.push(piece);
      }
    }

    // Fill remaining up to limit
    for (const p of allProducts) {
      if (finalCandidates.length >= limit) break;
      if (!selectedIds.has(p.id)) {
        selectedIds.add(p.id);
        finalCandidates.push(p);
      }
    }
  }

  return {
    candidates: finalCandidates,
    intent
  };
}
