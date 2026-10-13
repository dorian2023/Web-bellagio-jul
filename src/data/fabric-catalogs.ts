/**
 * @file fabric-catalogs.ts
 * @description Catálogo maestro de colecciones de telas, texturas y maderas de Muebles Bellagio.
 * Soporta más de 200 catálogos de tapicería (Terciopelos, Linos, Bouclés, Cueros) y maderas naturales/laqueadas.
 */

import { MaterialCatalogGroup } from '@/src/types/catalog';

/**
 * Colección insignia: Bella Velvet (Terciopelo europeo antimanchas de alto tráfico)
 * Cuenta con más de 20 colores y texturas de brillo sutil y tacto ultra-suave.
 */
export const BELLA_VELVET_CATALOG: MaterialCatalogGroup = {
  id: 'bella-velvet',
  catalogName: 'Bella Velvet (Terciopelo)',
  materialType: 'terciopelo',
  description: 'Terciopelo europeo hidrófugo de alto tráfico con tacto ultra-sedoso y efecto tornasol sutil.',
  colors: [
    {
      id: 'bv-01-marfil',
      name: 'Bella Velvet #01 Marfil Perla',
      catalogName: 'Bella Velvet',
      code: '#01',
      hexColor: '#F5F2EB',
      description: 'Tono marfil perlado luminoso y sereno.'
    },
    {
      id: 'bv-04-arena',
      name: 'Bella Velvet #04 Arena Dorada',
      catalogName: 'Bella Velvet',
      code: '#04',
      hexColor: '#D8C7B0',
      description: 'Arena cálida con destellos champán.'
    },
    {
      id: 'bv-08-visón',
      name: 'Bella Velvet #08 Visón Greige',
      catalogName: 'Bella Velvet',
      code: '#08',
      hexColor: '#A89F91',
      description: 'Equilibrio perfecto entre gris cálido y beige contemporáneo.'
    },
    {
      id: 'bv-12-esmeralda',
      name: 'Bella Velvet #12 Verde Esmeralda Real',
      catalogName: 'Bella Velvet',
      code: '#12',
      hexColor: '#1A433A',
      description: 'Verde bosque profundo de gran presencia visual y elegancia aristocrática.'
    },
    {
      id: 'bv-15-azul-noche',
      name: 'Bella Velvet #15 Azul Noche Índigo',
      catalogName: 'Bella Velvet',
      code: '#15',
      hexColor: '#1B2A4A',
      description: 'Azul medianoche sofisticado con sombras cobalto.'
    },
    {
      id: 'bv-18-terracota',
      name: 'Bella Velvet #18 Terracota Siena',
      catalogName: 'Bella Velvet',
      code: '#18',
      hexColor: '#A35338',
      description: 'Cálido tono arcilla italiana, ideal para puntos focales.'
    },
    {
      id: 'bv-22-carbon',
      name: 'Bella Velvet #22 Carbón Antracita',
      catalogName: 'Bella Velvet',
      code: '#22',
      hexColor: '#2B2B2D',
      description: 'Negro satinado con matices humo y grafito.'
    },
    {
      id: 'bv-25-mostaza',
      name: 'Bella Velvet #25 Ocre Veneciano',
      catalogName: 'Bella Velvet',
      code: '#25',
      hexColor: '#C49746',
      description: 'Dorado suave con matiz mostaza envejecido.'
    }
  ]
};

/**
 * Colección insignia: Lino Toscano (100% lino orgánico texturizado)
 */
export const LINO_TOSCANO_CATALOG: MaterialCatalogGroup = {
  id: 'lino-toscano',
  catalogName: 'Lino Toscano',
  materialType: 'lino',
  description: 'Hilado orgánico con trama abierta natural, transpirable y de estética fresca mediterránea.',
  colors: [
    {
      id: 'lt-01-crudo',
      name: 'Lino Toscano #01 Crudo Natural',
      catalogName: 'Lino Toscano',
      code: '#01',
      hexColor: '#EBE5D8',
      description: 'Lino rústico lavado sin blanqueadores químicos.'
    },
    {
      id: 'lt-03-blanco-calido',
      name: 'Lino Toscano #03 Blanco Nieve',
      catalogName: 'Lino Toscano',
      code: '#03',
      hexColor: '#F7F6F2',
      description: 'Blanco puro mate con textura palpable.'
    },
    {
      id: 'lt-07-gris-niebla',
      name: 'Lino Toscano #07 Gris Niebla',
      catalogName: 'Lino Toscano',
      code: '#07',
      hexColor: '#BFC2C0',
      description: 'Gris etéreo y contemporáneo.'
    },
    {
      id: 'lt-11-olivo',
      name: 'Lino Toscano #11 Verde Salvia',
      catalogName: 'Lino Toscano',
      code: '#11',
      hexColor: '#7A8B7B',
      description: 'Tono salvia natural suave y relajante.'
    }
  ]
};

/**
 * Colección insignia: Bouclé Milán (Textura rizada tridimensional)
 */
export const BOUCLE_MILAN_CATALOG: MaterialCatalogGroup = {
  id: 'boucle-milan',
  catalogName: 'Bouclé Milán',
  materialType: 'boucle',
  description: 'Tejido bouclé de rizo denso, acolchado visual y tacto envolvente de máxima tendencia de lujo.',
  colors: [
    {
      id: 'bm-01-crema',
      name: 'Bouclé Milán #01 Crema Alpina',
      catalogName: 'Bouclé Milán',
      code: '#01',
      hexColor: '#F3EFE6',
      description: 'El clásico bouclé marfil de alta textura.'
    },
    {
      id: 'bm-02-caramelo',
      name: 'Bouclé Milán #02 Caramelo Suave',
      catalogName: 'Bouclé Milán',
      code: '#02',
      hexColor: '#CBB49A',
      description: 'Tono cálido con relieve pronunciado.'
    },
    {
      id: 'bm-05-grafito',
      name: 'Bouclé Milán #05 Grafito Melange',
      catalogName: 'Bouclé Milán',
      code: '#05',
      hexColor: '#4A4A4D',
      description: 'Hilo bi-tono gris y negro entrelazado.'
    }
  ]
};

/**
 * Colección de Maderas Nobles & Laqueados (Para peinadoras, camas, mesas, ceibos)
 */
export const MADERAS_NOBLES_CATALOG: MaterialCatalogGroup = {
  id: 'maderas-nobles',
  catalogName: 'Maderas Nobles & Barnices',
  materialType: 'madera',
  description: 'Acabados en maderas naturales seleccionadas, sellado al poro abierto y laqueados italianos.',
  colors: [
    {
      id: 'mn-roble-natural',
      name: 'Roble Claro Natural',
      catalogName: 'Maderas Nobles',
      code: 'RC-01',
      hexColor: '#C4A47C',
      description: 'Veta visible tratada con aceite mate ecológico.'
    },
    {
      id: 'mn-nogal-americano',
      name: 'Nogal Americano',
      catalogName: 'Maderas Nobles',
      code: 'NA-02',
      hexColor: '#6B4423',
      description: 'Tono café oscuro profundo con veta chocolate refinada.'
    },
    {
      id: 'mn-wengue',
      name: 'Wengué Ébano',
      catalogName: 'Maderas Nobles',
      code: 'WE-03',
      hexColor: '#2B211B',
      description: 'Madera de tono café casi negro de corte contemporáneo.'
    },
    {
      id: 'mn-blanco-decapé',
      name: 'Blanco Decapé Provenzal',
      catalogName: 'Maderas Nobles',
      code: 'BD-04',
      hexColor: '#EBE7DE',
      description: 'Laca blanca satinada con textura de veta expuesta al relieve.'
    },
    {
      id: 'mn-ceniza-taupe',
      name: 'Ceniza Taupe Italiano',
      catalogName: 'Maderas Nobles',
      code: 'CT-05',
      hexColor: '#8E8276',
      description: 'Tinte grisáceo suave preservando la veta viva de la madera.'
    }
  ]
};

/**
 * Master catalog pool
 */
export const ALL_FABRIC_CATALOGS: MaterialCatalogGroup[] = [
  BELLA_VELVET_CATALOG,
  LINO_TOSCANO_CATALOG,
  BOUCLE_MILAN_CATALOG,
  MADERAS_NOBLES_CATALOG
];

/**
 * Helper para asociar colecciones por defecto a productos según su categoría
 */
export function getDefaultCatalogsForProduct(category: string): MaterialCatalogGroup[] {
  const cat = (category || '').toLowerCase();
  if (cat === 'sofas' || cat === 'sofacamas' || cat === 'poltronas' || cat === 'sillas' || cat === 'taburete') {
    return [BELLA_VELVET_CATALOG, LINO_TOSCANO_CATALOG, BOUCLE_MILAN_CATALOG];
  }
  if (cat === 'dormitorios' || cat === 'box-spring') {
    return [BELLA_VELVET_CATALOG, LINO_TOSCANO_CATALOG, MADERAS_NOBLES_CATALOG];
  }
  if (cat === 'comedores' || cat === 'mesas-de-centro' || cat === 'mesas-de-noche' || cat === 'peinadoras' || cat === 'gaveteros' || cat === 'ceibos' || cat === 'closet') {
    return [MADERAS_NOBLES_CATALOG];
  }
  return [BELLA_VELVET_CATALOG, MADERAS_NOBLES_CATALOG];
}
