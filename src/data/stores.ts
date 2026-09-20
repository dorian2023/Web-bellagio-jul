/**
 * @file stores.ts
 * @description Official showroom and store data for Muebles Bellagio in Caracas, Venezuela.
 */

import { StoreLocation } from '@/src/types/catalog';

export const STORES_DATA: StoreLocation[] = [
  {
    id: 'tienda-comercio',
    name: 'Bellagio JK',
    badge: 'Sede Principal',
    videoUrl: '/videos/tienda-principal.mp4',
    posterUrl: '/images/stores/tienda-comercio.jpg',
    address: 'Av. Comercio, Caracas, Distrito Capital, Venezuela.',
    landmark: 'Edf. Comercial Bellagio, Planta Baja',
    phone: '+58 212-0000000',
    mobile: '+58 414-1536516',
    whatsapp: '584141536516',
    schedule: 'Lunes a Sábado: 9:00 AM - 5:00 PM | Domingos: 10:00 AM - 3:00 PM',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av+Comercio+Caracas+Venezuela',
    features: [
      'Estacionamiento Privado',
      'Asesoría Personalizada',
      'Render 3D',
      'Asesoría de Interiorismo',
      'Exhibición Actualizada'
    ]
  },
  {
    id: 'tienda-mobili',
    name: 'Bellagio Mobili',
    badge: '2 Showrooms Exclusivos',
    videoUrl: '/videos/tienda-mobili.mp4',
    posterUrl: '/images/stores/tienda-mobili.jpg',
    address: 'Av. Comercio de Bella Vista, vía La Yaguara, C.C. Davinci, Caracas.',
    landmark: 'C.C. Davinci — 2 Grandes Showrooms con amplia variedad de productos',
    phone: '+58 212-0000001',
    mobile: '+58 414-1536516',
    whatsapp: '584141536516',
    schedule: 'Lunes a Sábado: 9:00 AM - 5:00 PM | Domingos: 10:00 AM - 3:00 PM',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Centro+Comercial+Davinci+La+Yaguara+Caracas',
    features: [
      '2 Showrooms en C.C. Davinci',
      'Estacionamiento Privado',
      'Asesoría Personalizada',
      'Exhibición Actualizada',
      'Productos Importados'
    ]
  },
  {
    id: 'tienda-casamall',
    name: 'Bellagio Collezione',
    badge: '2 Showrooms Exclusivos',
    videoUrl: '/videos/tienda-casamall.mp4',
    posterUrl: '/images/stores/tienda-casamall.jpg',
    address: 'Av. Principal de Los Naranjos, C.C. Casa Mall, Nivel Galería, local G20, Urb. El Cafetal, Caracas.',
    landmark: 'C.C. Casa Mall — Nivel Galería (2 Grandes Showrooms)',
    phone: '+58 212-0000002',
    mobile: '+58 414-1536516',
    whatsapp: '584141536516',
    schedule: 'Lunes a Sábado: 10:00 AM - 7:00 PM',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Casa+Mall+Los+Naranjos+Caracas',
    features: [
      '2 Showrooms en Casa Mall',
      'Estacionamiento Privado',
      'Diseño de Vanguardia',
      'Asesoría Personalizada',
      'Servicio de Proyectos 3D'
    ]
  }
];
