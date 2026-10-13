/**
 * @file color-presets.ts
 * @description Paleta de colores de tapicería y acabados comunes en Muebles Bellagio.
 * Permite al administrador buscar un color por nombre ("rosado", "negro"...) al asignar
 * fotos reales por color a un producto. Siempre se puede crear un color personalizado.
 */

export interface ColorPreset {
  name: string;
  hexColor: string;
  /** Palabras alternativas para que la búsqueda encuentre el color (sin tildes). */
  keywords: string[];
}

export const COLOR_PRESETS: readonly ColorPreset[] = [
  { name: 'Bipiel Negro', hexColor: '#1C1C1E', keywords: ['negro', 'cuero', 'semicuero', 'black'] },
  { name: 'Negro', hexColor: '#111111', keywords: ['black', 'oscuro'] },
  { name: 'Gris Oscuro', hexColor: '#4A4A4D', keywords: ['grafito', 'carbon', 'antracita', 'plomo'] },
  { name: 'Gris Claro', hexColor: '#BFC2C0', keywords: ['perla', 'plata', 'niebla'] },
  { name: 'Blanco', hexColor: '#F7F6F2', keywords: ['white', 'nieve'] },
  { name: 'Marfil', hexColor: '#F2EDE2', keywords: ['crema', 'hueso', 'ivory', 'off white'] },
  { name: 'Beige', hexColor: '#D8C7B0', keywords: ['arena', 'crudo', 'lino', 'nude'] },
  { name: 'Greige / Visón', hexColor: '#A89F91', keywords: ['taupe', 'vison', 'topo'] },
  { name: 'Marrón Chocolate', hexColor: '#5A3A24', keywords: ['marron', 'cafe', 'chocolate', 'brown'] },
  { name: 'Caramelo', hexColor: '#B07A45', keywords: ['camel', 'cognac', 'miel', 'tabaco'] },
  { name: 'Rosado', hexColor: '#E8B4C0', keywords: ['rosa', 'pink', 'rosado'] },
  { name: 'Rosado Palo', hexColor: '#D9A9A6', keywords: ['rosa viejo', 'blush', 'empolvado', 'rosado'] },
  { name: 'Fucsia', hexColor: '#C2185B', keywords: ['magenta', 'rosa fuerte'] },
  { name: 'Vino Tinto', hexColor: '#6D1F2C', keywords: ['bordo', 'burgundy', 'vinotinto', 'granate'] },
  { name: 'Rojo', hexColor: '#B3261E', keywords: ['red'] },
  { name: 'Terracota', hexColor: '#A35338', keywords: ['ladrillo', 'oxido', 'naranja'] },
  { name: 'Mostaza', hexColor: '#C49746', keywords: ['ocre', 'amarillo', 'dorado'] },
  { name: 'Verde Esmeralda', hexColor: '#1A433A', keywords: ['verde', 'botella', 'bosque'] },
  { name: 'Verde Salvia', hexColor: '#7A8B7B', keywords: ['verde', 'oliva', 'menta'] },
  { name: 'Azul Marino', hexColor: '#1B2A4A', keywords: ['azul', 'navy', 'indigo', 'noche'] },
  { name: 'Azul Petróleo', hexColor: '#1F4E5A', keywords: ['azul', 'turquesa', 'teal', 'petroleo'] },
  { name: 'Celeste', hexColor: '#A9C6DE', keywords: ['azul claro', 'cielo', 'baby blue'] },
  { name: 'Lila', hexColor: '#B6A3C9', keywords: ['morado', 'lavanda', 'purpura', 'violeta'] },
  { name: 'Madera Natural', hexColor: '#C4A47C', keywords: ['roble', 'madera', 'pino'] },
  { name: 'Madera Nogal', hexColor: '#6B4423', keywords: ['nogal', 'madera', 'caoba'] },
  { name: 'Wengué', hexColor: '#2B211B', keywords: ['wengue', 'madera oscura'] },
];

/** Normaliza texto para búsqueda insensible a mayúsculas y tildes. */
export function normalizeSearchText(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

/** Busca colores por nombre o palabra clave. Devuelve toda la paleta si la búsqueda está vacía. */
export function searchColorPresets(query: string): ColorPreset[] {
  const q = normalizeSearchText(query);
  if (!q) return [...COLOR_PRESETS];
  return COLOR_PRESETS.filter((preset) =>
    normalizeSearchText(preset.name).includes(q) ||
    preset.keywords.some((k) => normalizeSearchText(k).includes(q))
  );
}

const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;

/** Valida un color HEX de 6 dígitos (previene inyección de CSS arbitrario en `style`). */
export function sanitizeHexColor(value: unknown, fallback = '#C5A55A'): string {
  return typeof value === 'string' && HEX_COLOR_PATTERN.test(value) ? value : fallback;
}
