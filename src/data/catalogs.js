/**
 * @file catalogs.js
 * @description Catalog and collections data for Muebles Bellagio.
 * High-definition luxury furniture imagery, technical specifications, and 17 alphabetical categories.
 */

export const CATEGORIES_DATA = [
  { id: 'todos', name: 'Todas las Categorías', count: 24 },
  { id: 'box-spring', name: 'Box Spring', count: 2 },
  { id: 'ceibos', name: 'Ceibos', count: 2 },
  { id: 'closet', name: 'Closet', count: 2 },
  { id: 'comedores', name: 'Comedores', count: 3 },
  { id: 'dormitorios', name: 'Dormitorios', count: 3 },
  { id: 'espejos', name: 'Espejos', count: 2 },
  { id: 'gaveteros', name: 'Gaveteros', count: 2 },
  { id: 'mesas-de-centro', name: 'Mesas de Centro', count: 2 },
  { id: 'mesas-de-noche', name: 'Mesas de Noche', count: 2 },
  { id: 'mesas-tv', name: 'Mesas Tv', count: 2 },
  { id: 'peinadoras', name: 'Peinadoras', count: 2 },
  { id: 'poltronas', name: 'Poltronas', count: 2 },
  { id: 'sillas', name: 'Sillas', count: 2 },
  { id: 'sofacamas', name: 'Sofacamas', count: 2 },
  { id: 'sofas', name: 'Sofas', count: 3 },
  { id: 'taburete', name: 'Taburete', count: 2 },
  { id: 'zapateras', name: 'Zapateras', count: 2 }
];

export const CATALOGS_DATA = [
  // 1. Box Spring
  {
    id: 'box-spring-royal-ortopedic',
    category: 'box-spring',
    categoryName: 'Box Spring',
    title: 'Box Spring Royal Ortopédico',
    subtitle: 'Base Tapizada Ergonómica con Colchón Euro-Top',
    description: 'Sistema de descanso premium con soporte perimetral reforzado, resortes encapsulados individuales y acolchado de espuma viscoelástica con memoria.',
    materials: 'Madera de pino tratada, Resortes Pocket independientes, Tela Jacquard importada tratada con iones de plata.',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80',
    dimensions: 'King Size 200 x 200 x 68 cm | Queen Size 160 x 190 x 68 cm',
    availableColors: ['Gris Antracita', 'Beige Lino', 'Azul Marino']
  },
  {
    id: 'box-spring-imperiale-confort',
    category: 'box-spring',
    categoryName: 'Box Spring',
    title: 'Box Spring Imperiale Diamond',
    subtitle: 'Base Somier de Lujo con Sistema de Ventilación 3D',
    description: 'Base de estructura alemana de alta resistencia para absorción de impactos con patas en acero cepillado electroplatinado en oro mate.',
    materials: 'Estructura indeformable, Aislamiento acústico, Tejido stretch hipoalergénico.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    dimensions: 'King 200 x 200 cm | Matrimonial 140 x 190 cm',
    availableColors: ['Champagne Satin', 'Negro Obsidiana']
  },

  // 2. Ceibos
  {
    id: 'ceibo-palazzo-antico',
    category: 'ceibos',
    categoryName: 'Ceibos',
    title: 'Ceibo Buffet Palazzo Venezia',
    subtitle: 'Aparador de Gran Capacidad en Nogal y Detalles Dorados',
    description: 'Mueble ceibo para vajillas y cristalería fina con 4 puertas de cierre suave, gavetas interiores forradas en terciopelo y repisas de vidrio templado.',
    materials: 'Madera maciza de nogal europeo, Herrajes Blum con amortiguación, Tiradores en latón pulido.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    dimensions: '220 cm (largo) x 50 cm (profundo) x 90 cm (alto)',
    availableColors: ['Nogal Italiano', 'Roble Ahumado', 'Laca Negra Piano']
  },
  {
    id: 'ceibo-milano-cristal',
    category: 'ceibos',
    categoryName: 'Ceibos',
    title: 'Ceibo Vitrina Milano Loft',
    subtitle: 'Credenza Moderna con Iluminación LED Indirecta Cálida',
    description: 'Diseño arquitectónico contemporáneo con tope superior en mármol sintetizado ultra-resistente y puertas con marco de aluminio minimalista.',
    materials: 'Tope de mármol sintetizado, Vidrio acanalado Fluted Glass, Iluminación LED 3000K integrada.',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    dimensions: '190 cm x 45 cm x 85 cm',
    availableColors: ['Blanco Calacatta & Oro', 'Gris Grafito & Roble']
  },

  // 3. Closet
  {
    id: 'closet-walkin-haute-couture',
    category: 'closet',
    categoryName: 'Closet',
    title: 'Vestidor Walk-In Haute Couture',
    subtitle: 'Sistema Modular a Medida con Isla Central e Iluminación Sensorial',
    description: 'Módulo de armario de lujo personalizado con zapateras extraíbles, pantaloneros iluminados, gavetas con organizadores de joyería y puertas de vidrio templado bronce.',
    materials: 'Estructura de melamina hidrófuga de 18mm, Perfilería en aluminio champagne, Sensores de presencia LED.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    dimensions: 'Diseño modular a medida según espacio del cliente',
    availableColors: ['Roble Bardolino', 'Gris Textil Suizo', 'Nogal Terracota']
  },
  {
    id: 'closet-armario-roma-tres-puertas',
    category: 'closet',
    categoryName: 'Closet',
    title: 'Armario Roma Master 3 Puertas',
    subtitle: 'Closet con Puertas Corredizas de Cierre Suave y Espejo Central',
    description: 'Armario de gran capacidad de almacenamiento con distribución interna inteligente para colgado largo, doblado y gavetas con correderas telescópicas pesadas.',
    materials: 'MDF de alta densidad termoformado, Espejo de seguridad biselado, Rieles de deslizamiento silencioso.',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80',
    dimensions: '240 cm (ancho) x 65 cm (profundidad) x 230 cm (alto)',
    availableColors: ['Blanco Puro Mate', 'Roble Americano', 'Gris Nube']
  },

  // 4. Comedores
  {
    id: 'comedor-marmo-roma',
    category: 'comedores',
    categoryName: 'Comedores',
    title: 'Comedor Marmo di Roma',
    subtitle: 'Mesa de Mármol Calacatta Gold con Sillas de Diseñador',
    description: 'Mesa con tope de mármol natural importado de 30mm, base escultórica de diseño geométrico y 8 sillas ergonómicas con costuras artesanales.',
    materials: 'Mármol Calacatta Gold sellado, Estructura de nogal americano, Piel sintética grado automotriz.',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
    dimensions: '260 cm x 120 cm x 76 cm (Capacidad 8-10 puestos)',
    availableColors: ['Blanco Calacatta', 'Negro Marquina', 'Marrón Emperador']
  },
  {
    id: 'comedor-milano-moderno',
    category: 'comedores',
    categoryName: 'Comedores',
    title: 'Juego de Comedor Milano Loft',
    subtitle: 'Mesa Extensible en Madera Maciza con Sillas Tapizadas',
    description: 'Innovador sistema de apertura telescópica oculta que amplía de 6 a 10 comensales sin perder estabilidad ni la pureza de sus líneas arquitectónicas.',
    materials: 'Madera de teca y roble selecto, Herrajes alemanes de precisión, Tela antimanchas Aquaclean.',
    image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?auto=format&fit=crop&w=1200&q=80',
    dimensions: '180-260 cm x 100 cm x 76 cm',
    availableColors: ['Roble Natural', 'Nogal Oscuro', 'Wengué']
  },
  {
    id: 'comedor-extensible-j020',
    category: 'comedores',
    categoryName: 'Comedores',
    title: 'Comedor Extensible J-020',
    subtitle: '6 Puestos con Acabados en Maderas Nobles y Cristal Templado',
    description: 'Modelo insignia de la colección Bellagio Milano. Sillas de confort envolvente y mesa extensible con mecanismo anti-fricción.',
    materials: 'Madera de cedro, Vidrio templado 10mm, Tapicería antimanchas.',
    image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    dimensions: '160-220 cm x 95 cm x 76 cm',
    availableColors: ['Nogal Claro', 'Roble Italiano', 'Tabaco Oscuro']
  },

  // 5. Dormitorios
  {
    id: 'recamara-palazzo-suite',
    category: 'dormitorios',
    categoryName: 'Dormitorios',
    title: 'Dormitorio Palazzo Suite King',
    subtitle: 'Cama King Size con Cabecera Tapizada y Mesas Flotantes',
    description: 'Conjunto master suite con iluminación LED perimetral indirecta integrada en la cabecera capitoné, gaveteros con cierre suave y herrajes premium.',
    materials: 'Madera de cedro tratada, Lino fino importado, Acabados en laca poliuretano piano.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    dimensions: 'Cama King 220 cm x 210 cm | Cabecera altura 160 cm',
    availableColors: ['Beige Crema', 'Gris Carbón', 'Verde Bosque']
  },
  {
    id: 'dormitorio-florencia-gold',
    category: 'dormitorios',
    categoryName: 'Dormitorios',
    title: 'Juego de Dormitorio Florencia Gold',
    subtitle: 'Cama Queen con Cabecero Acolchado e Inserciones de Bronce',
    description: 'Elegancia atemporal con mesitas de noche a juego con tiradores dorados artesanales y base de cama con baúl de almacenaje hidráulico.',
    materials: 'Roble macizo, Terciopelo repelente a líquidos, Pistones hidráulicos alemanes.',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    dimensions: 'Cama Queen 175 cm x 215 cm | Mesitas 55 x 45 x 50 cm',
    availableColors: ['Arena Dorada', 'Rosa Nude Suave', 'Gris Platino']
  },
  {
    id: 'dormitorio-zen-tokyo',
    category: 'dormitorios',
    categoryName: 'Dormitorios',
    title: 'Dormitorio Zen Minimalist',
    subtitle: 'Cama de Plataforma Baja con Mesas Integradas',
    description: 'Líneas limpias inspiradas en el diseño japonés contemporáneo. Sensación de flotabilidad y máxima solidez estructural.',
    materials: 'Madera de fresno natural, Aceites protectores ecológicos mate.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    dimensions: '210 cm x 220 cm x 35 cm',
    availableColors: ['Madera Natural Clara', 'Nogal Zen', 'Ébano']
  },

  // 6. Espejos
  {
    id: 'espejo-soleil-gold',
    category: 'espejos',
    categoryName: 'Espejos',
    title: 'Espejo Escultórico Soleil Gold',
    subtitle: 'Espejo de Gran Formato con Marco Tallado en Hoja de Oro',
    description: 'Pieza de acento para salones y recibidores de alta gama. Cristal de 5mm con tratamiento anti-humedad y reflejo ultra-claro sin distorsión.',
    materials: 'Marco en resina de alta densidad dorada al agua, Cristal óptico de plata pura.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
    dimensions: '120 cm diámetro / Formato cuerpo entero 200 x 90 cm',
    availableColors: ['Oro Envejecido', 'Plata Pulida', 'Bronce Champán']
  },
  {
    id: 'espejo-arco-infinity',
    category: 'espejos',
    categoryName: 'Espejos',
    title: 'Espejo de Pie Arco Infinity',
    subtitle: 'Espejo de Cuerpo Entero con Marco de Metal Delgado e Iluminación Touch',
    description: 'Silueta curva de tendencia europea con soporte posterior plegable o anclaje a pared. Iluminación LED perimetral dimerizable.',
    materials: 'Marco de aluminio extruido ultra-delgado, Tira LED de alto CRI 95+.',
    image: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80',
    dimensions: '180 cm (alto) x 80 cm (ancho)',
    availableColors: ['Dorado Cepillado', 'Negro Mate', 'Oro Rosa']
  },

  // 7. Gaveteros
  {
    id: 'gavetero-venezia-seis-cajones',
    category: 'gaveteros',
    categoryName: 'Gaveteros',
    title: 'Cómoda Gavetero Venezia 6 Cajones',
    subtitle: 'Gavetero Ancho con Frontales Ranurados y Tiradores de Latón',
    description: 'Organización impecable con 6 amplios cajones con correderas de extensión total oculta y tope resistente a rayones.',
    materials: 'MDF laqueado en poro abierto, Maderas nobles, Tiradores macizos dorados.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    dimensions: '150 cm (ancho) x 48 cm (fondo) x 85 cm (alto)',
    availableColors: ['Gris Plomo Mate', 'Blanco Marfil', 'Verde Oliva Profundo']
  },
  {
    id: 'gavetero-chiffonier-alto-nordic',
    category: 'gaveteros',
    categoryName: 'Gaveteros',
    title: 'Chifonier Alto Bellagio Slim',
    subtitle: 'Torre de 5 Gavetas Vertical para Espacios Exclusivos',
    description: 'Aprovecha la verticalidad con elegancia. Incluye primer cajón con organizador aterciopelado para relojes y joyas.',
    materials: 'Madera de roble natural, Interior en terciopelo negro, Correderas push-to-open.',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    dimensions: '75 cm x 45 cm x 125 cm',
    availableColors: ['Roble Suizo', 'Nogal Americano']
  },

  // 8. Mesas de Centro
  {
    id: 'mesa-centro-calacatta-duo',
    category: 'mesas-de-centro',
    categoryName: 'Mesas de Centro',
    title: 'Set de Mesas Nido Calacatta Duo',
    subtitle: 'Mesas Circulares en Mármol Natural y Base Cilíndrica Ranurada',
    description: 'Conjunto de 2 mesas nido de alturas complementarias que se pueden traslapar o separar para dinamizar el ambiente de sala.',
    materials: 'Tope de mármol Calacatta pulido, Base en madera maciza lacada con acabado oro en zócalo.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80',
    dimensions: 'Mesa grande: 90 cm diam. x 42 cm alto | Mesa chica: 60 cm diam. x 48 cm alto',
    availableColors: ['Mármol Blanco & Nogal', 'Mármol Negro Marquina & Roble']
  },
  {
    id: 'mesa-centro-escultural-bronce',
    category: 'mesas-de-centro',
    categoryName: 'Mesas de Centro',
    title: 'Mesa de Centro Escultural Trinity',
    subtitle: 'Tope de Cristal Templado Ahumado con Base Tridimensional Dorada',
    description: 'Verdadera obra de arte contemporánea en el centro de tu sala. Reflejos espectaculares con luz natural y artificial.',
    materials: 'Vidrio templado biselado de 12mm, Acero inoxidable bañado en titanio oro.',
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80',
    dimensions: '120 cm x 70 cm x 44 cm',
    availableColors: ['Cristal Bronce & Oro', 'Cristal Ahumado & Negro Titanio']
  },

  // 9. Mesas de Noche
  {
    id: 'mesa-noche-florencia-cajon',
    category: 'mesas-de-noche',
    categoryName: 'Mesas de Noche',
    title: 'Mesa de Noche Florencia Luxury',
    subtitle: '2 Gavetas de Cierre Silencioso con Tope en Mármol y Acentos Oro',
    description: 'El complemento definitivo para tu cama master. Superficie superior de piedra sinterizada a prueba de agua y manchas.',
    materials: 'Madera tratada, Tope porcelánico efecto mármol, Patas de acero electrostático.',
    image: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?auto=format&fit=crop&w=1200&q=80',
    dimensions: '55 cm (ancho) x 42 cm (fondo) x 50 cm (alto)',
    availableColors: ['Gris Ceniza & Dorado', 'Crema & Nogal', 'Negro Mate & Oro']
  },
  {
    id: 'mesa-noche-flotante-led',
    category: 'mesas-de-noche',
    categoryName: 'Mesas de Noche',
    title: 'Mesa de Noche Flotante Aura',
    subtitle: 'Diseño Suspendido de Pared con Iluminación Nocturna Suave',
    description: 'Efecto de ligereza total en la habitación con cargador inalámbrico invisible para smartphones integrado en la cubierta.',
    materials: 'Chapa de nogal natural, Rieles ocultos de extracción total, Módulo Qi de carga rápida.',
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4570?auto=format&fit=crop&w=1200&q=80',
    dimensions: '50 cm x 38 cm x 24 cm',
    availableColors: ['Nogal Claro', 'Roble Carbón']
  },

  // 10. Mesas Tv
  {
    id: 'mesa-tv-rack-cinema-master',
    category: 'mesas-tv',
    categoryName: 'Mesas Tv',
    title: 'Mueble TV & Centro de Entretenimiento Cinema',
    subtitle: 'Panel Flotante para Pantallas hasta 85" con Chimenea Bioetanol / LED',
    description: 'Conjunto para Home Theater de lujo con gestión oculta de cables, compartimentos acústicos para barras de sonido y acabados en mármol y madera listonada.',
    materials: 'Panel alistonado de madera maciza, Mármol sintetizado, Iluminación LED difusa.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    dimensions: '260 cm (largo) x 40 cm (profundidad) x 180 cm (alto total)',
    availableColors: ['Roble Tostado & Mármol Negro', 'Blanco Nieve & Oro Mate']
  },
  {
    id: 'mesa-tv-lowboard-milano',
    category: 'mesas-tv',
    categoryName: 'Mesas Tv',
    title: 'Lowboard Mueble TV Milano Slim',
    subtitle: 'Mesa Baja Contemporánea con Puertas de Cierre Amortiguado',
    description: 'Diseño estilizado con patas cónicas doradas y puertas con textura acanalada de alta precisión artesanal.',
    materials: 'Estructura en madera de ingeniería resistente, Detalles en latón pulido.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    dimensions: '200 cm x 42 cm x 48 cm',
    availableColors: ['Nogal Italiano', 'Gris Grafito Satinado']
  },

  // 11. Peinadoras
  {
    id: 'peinadora-vanity-hollywood-gold',
    category: 'peinadoras',
    categoryName: 'Peinadoras',
    title: 'Tocador Peinadora Vanity Hollywood Gold',
    subtitle: 'Mueble de Maquillaje con Espejo LED Táctil y Taburete Acolchado Incluido',
    description: 'El rincón de cuidado personal soñado. Espejo con 3 tonos de luz (cálida, neutra, fría), organizadores de acrílico y cajones aterciopelados.',
    materials: 'Tope de vidrio templado translúcido, Estructura en laca poliuretano, Taburete tapizado en bouclé.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    dimensions: '120 cm x 45 cm x 78 cm (Mesa) | Espejo 50 cm diam.',
    availableColors: ['Blanco Perla & Oro', 'Rosa Palo & Oro Rosa', 'Gris Seda']
  },
  {
    id: 'peinadora-tocador-palazzo-espejo',
    category: 'peinadoras',
    categoryName: 'Peinadoras',
    title: 'Tocador Peinadora Palazzo di Lusso',
    subtitle: 'Cómoda Tocador en Nogal con Espejo Tríptico Plegable',
    description: 'Estilo clásico renovado para residencias exclusivas. Espejo tríptico que permite visión en 180° y gavetas con cerradura oculta.',
    materials: 'Madera maciza de nogal, Espejos biselados italianos, Herrajes dorados a mano.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    dimensions: '140 cm x 50 cm x 82 cm',
    availableColors: ['Nogal Real', 'Caoba Clásica']
  },

  // 12. Poltronas
  {
    id: 'poltrona-bergere-lounge-gold',
    category: 'poltronas',
    categoryName: 'Poltronas',
    title: 'Poltrona Bergère Royale Lounge',
    subtitle: 'Sillón Individual Giratorio en Cuero Italiano o Terciopelo',
    description: 'Comodidad ergonómica superior con respaldo alto, soporte lumbar diseñado para largas lecturas y base giratoria dorada de giro continuo.',
    materials: 'Cuero flor de piel italiana / Terciopelo suave, Espuma moldeada en frío HR-50, Base de fundición en oro.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    dimensions: '88 cm (ancho) x 90 cm (profundidad) x 105 cm (alto)',
    availableColors: ['Cuero Coñac', 'Mostaza Velvet', 'Azul Petróleo', 'Blanco Lino']
  },
  {
    id: 'poltrona-sculptural-curva',
    category: 'poltronas',
    categoryName: 'Poltronas',
    title: 'Butaca Escultural Aurora',
    subtitle: 'Poltrona de Silueta Orgánica en Tejido Bouclé Francés',
    description: 'Diseño vanguardista de curvas envolventes que aporta sofisticación y calidez a cualquier ambiente residencial o corporativo.',
    materials: 'Tejido Bouclé de lana de alpaca sintética, Estructura de pino macizo secado en horno.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    dimensions: '82 cm x 80 cm x 76 cm',
    availableColors: ['Blanco Crudo', 'Verde Salvia', 'Terracota Warm']
  },

  // 13. Sillas
  {
    id: 'sillas-comedor-monaco-set',
    category: 'sillas',
    categoryName: 'Sillas',
    title: 'Silla de Comedor Monaco Gold',
    subtitle: 'Silla Tapizada con Respaldo Curvo y Patas Cónicas en Oro',
    description: 'Equilibrio perfecto entre ligereza visual y máximo confort postural. Costuras reforzadas de alta costura.',
    materials: 'Estructura interna de acero electrosoldado, Espuma indeformable, Patas doradas con regatones niveladores.',
    image: 'https://images.unsplash.com/photo-1580481077195-cbb1b1c67d16?auto=format&fit=crop&w=1200&q=80',
    dimensions: '54 cm x 58 cm x 84 cm (Altura asiento 47 cm)',
    availableColors: ['Gris Perla', 'Verde Esmeralda', 'Champán', 'Negro Cuero']
  },
  {
    id: 'silla-escritorio-executive-leather',
    category: 'sillas',
    categoryName: 'Sillas',
    title: 'Sillón Ejecutivo Bellagio Director',
    subtitle: 'Silla de Oficina Ergonómica en Piel Genuina con Detalles en Madera',
    description: 'Mecanismo sincro de reclinación multibloqueo, soporte lumbar dinámico y apoyabrazos acolchados con apliques en nogal.',
    materials: 'Cuero genuino vacuno, Pistón de gas clase 4 alemán, Base de aluminio pulido.',
    image: 'https://images.unsplash.com/photo-1580481077195-cbb1b1c67d16?auto=format&fit=crop&w=1200&q=80',
    dimensions: '68 cm x 68 cm x 115-125 cm',
    availableColors: ['Negro Ejecutivo', 'Marrón Habano']
  },

  // 14. Sofacamas
  {
    id: 'sofacama-sistema-italiano-genova',
    category: 'sofacamas',
    categoryName: 'Sofacamas',
    title: 'Sofá Cama Genova Italian Mechanism',
    subtitle: 'Apertura Rápida en 1 Movimiento sin Retirar Cojines con Colchón 16cm',
    description: 'La solución perfecta para recibir invitados con el mismo confort que una cama matrimonial tradicional. Mecanismo de apertura asistida de alta gama.',
    materials: 'Malla electrosoldada italiana, Colchón viscoelástico ortopédico de 16cm, Tapizado desenfundable lavable.',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
    dimensions: 'Sofá: 205 x 95 x 88 cm | Cama abierta: 205 x 210 cm (Colchón 140x190)',
    availableColors: ['Gris Claro Antimanchas', 'Beige Piedra', 'Azul Océano']
  },
  {
    id: 'sofacama-clicclac-nordic',
    category: 'sofacamas',
    categoryName: 'Sofacamas',
    title: 'Sofá Cama Clic-Clac Scandinavian',
    subtitle: 'Diseño Compacto con 3 Posiciones (Sofá, Relax, Cama)',
    description: 'Ideal para apartamentos modernos y salas de estar multifuncionales. Patas de madera de haya natural con acentos dorados.',
    materials: 'Espuma HR de alta densidad, Tela de microfibra transpirable, Resortes zig-zag.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    dimensions: '190 cm x 90 cm x 82 cm | Cama: 190 x 115 cm',
    availableColors: ['Mostaza Cálido', 'Gris Grafito', 'Verde Menta']
  },

  // 15. Sofas
  {
    id: 'sofa-bellagio-imperiale-seccional',
    category: 'sofas',
    categoryName: 'Sofas',
    title: 'Sofá Seccional Bellagio Imperiale',
    subtitle: 'Sofá Modular en L en Terciopelo Italiano con Detalles en Bronce',
    description: 'Estructura en madera de roble macizo con tapizado en terciopelo hidrófugo de alta durabilidad, complementado con acentos dorados pulidos a mano.',
    materials: 'Roble macizo, Terciopelo europeo, Espuma de alta densidad HR-45, Acero electroplatinado en oro.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    dimensions: '340 cm x 210 cm x 88 cm',
    availableColors: ['Champagne Gold', 'Negro Ébano', 'Gris Perla', 'Azul Zafiro']
  },
  {
    id: 'sofa-chesterfield-leather-master',
    category: 'sofas',
    categoryName: 'Sofas',
    title: 'Sofá Chesterfield Grand Classique 3 Puestos',
    subtitle: 'Capitoné Artesanal Hecho a Mano en Piel Genuina Envejecida',
    description: 'El clásico atemporal de la alta ebanistería. Botones colocados a mano uno a uno, tachuelas decorativas en bronce y patas de madera maciza torneada.',
    materials: 'Cuero genuino vacuno tratado a mano, Madera de cedro secada al horno.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    dimensions: '230 cm x 95 cm x 78 cm',
    availableColors: ['Cuero Vintage Caramelo', 'Negro Imperial', 'Verde Inglés']
  },
  {
    id: 'sofa-curvo-modern-lounge',
    category: 'sofas',
    categoryName: 'Sofas',
    title: 'Sofá Curvo Bellagio Milano Lounge',
    subtitle: 'Diseño Orgánico Envolvente en Tejido Texturizado de Autor',
    description: 'Las formas onduladas más cotizadas del interiorismo de lujo internacional. Un centro focal inolvidable para salas de estar principales.',
    materials: 'Tejido premium antimanchas, Estructura curva reforzada, Cojines en pluma sintética hipoalergénica.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    dimensions: '290 cm x 135 cm x 82 cm',
    availableColors: ['Blanco Nieve Bouclé', 'Taupe Cálido', 'Gris Antracita']
  },

  // 16. Taburete
  {
    id: 'taburete-bar-palazzo-gold',
    category: 'taburete',
    categoryName: 'Taburete',
    title: 'Taburete de Bar & Desayunador Palazzo',
    subtitle: 'Banqueta Alta Giratoria Regulable con Respaldo y Base Dorada',
    description: 'Elegancia para barras de cocina y áreas de bar residenciales. Asiento ergonómico acolchado con reposapiés circular integrado.',
    materials: 'Piel sintética premium o terciopelo, Pistón hidráulico cromado en oro, Base pesada antivuelco.',
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
    dimensions: '45 cm x 45 cm x 85-110 cm (Altura asiento 60-85 cm)',
    availableColors: ['Negro & Oro', 'Blanco & Oro', 'Verde Esmeralda & Oro']
  },
  {
    id: 'taburete-puff-pouf-ottoman',
    category: 'taburete',
    categoryName: 'Taburete',
    title: 'Taburete Pouf Ottoman Di Lusso',
    subtitle: 'Banqueta Baja Redonda Aterciopelada con Anillo Central Dorado',
    description: 'Mueble auxiliar versátil para salas, vestidores y recámaras. Sirve como asiento adicional, reposapiés o apoyo decorativo.',
    materials: 'Terciopelo italiano plisado a mano, Aro de acero dorado, Base antideslizante.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    dimensions: '45 cm diámetro x 45 cm altura',
    availableColors: ['Rosa Viejo', 'Azul Noche', 'Champán', 'Gris Humo']
  },

  // 17. Zapateras
  {
    id: 'zapatera-recibidor-roma-espejo',
    category: 'zapateras',
    categoryName: 'Zapateras',
    title: 'Zapatera Recibidor Roma Luxury con Espejo',
    subtitle: 'Mueble Zapatero Slim de 3 Trampas Abatibles para 18 Pares',
    description: 'Profundidad ultra-delgada ideal para recibidores y pasillos estrechos sin restar espacio de circulación. Tope decorativo para llaves y fragancias.',
    materials: 'Madera de ingeniería lacada de alto brillo, Mecanismos abatibles de doble fila, Tiradores en oro mate.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    dimensions: '80 cm (ancho) x 25 cm (fondo) x 128 cm (alto)',
    availableColors: ['Blanco Piano & Oro', 'Nogal & Antracita', 'Gris Perla']
  },
  {
    id: 'zapatera-banco-entrada-tapizado',
    category: 'zapateras',
    categoryName: 'Zapateras',
    title: 'Zapatera Banco de Entrada Bellagio Welcome',
    subtitle: 'Banqueta Zapatero con Asiento Tapizado en Piel y 2 Niveles Metálicos',
    description: 'Funcionalidad y elegancia en la entrada de tu hogar. Permite calzarse cómodamente con capacidad para 8 pares de calzado diario.',
    materials: 'Estructura de acero con acabado oro mate cepillado, Asiento en cuero sintético acolchado capitoné.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    dimensions: '100 cm (largo) x 35 cm (profundidad) x 48 cm (alto)',
    availableColors: ['Cuero Negro & Oro', 'Cuero Caramelo & Oro', 'Lino Gris & Oro']
  }
];
