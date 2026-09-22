/**
 * @file stats.ts
 * @description Credibility statistics data for Muebles Bellagio.
 */

export interface StatItem {
  value: number;
  displayValue: string;
  suffix: string;
  label: string;
  description: string;
  badge?: string;
}

export const STATS_DATA: StatItem[] = [
  {
    value: 17,
    displayValue: '17',
    suffix: '',
    label: 'Años de Trayectoria',
    description: '17 años de maestría en el mercado mobiliario de alta gama en Venezuela',
    badge: 'Tradición'
  },
  {
    value: 100,
    displayValue: '100',
    suffix: '%',
    label: 'Diseño Exclusivo',
    description: 'Diseño exclusivo y productos importados de autor y excelente calidad',
    badge: 'Exclusividad'
  },
  {
    value: 10000,
    displayValue: '10.000',
    suffix: '+',
    label: 'Espacios Transformados',
    description: 'Más de 10.000 habitaciones, salas y comedores entregados a satisfacción',
    badge: 'Confianza'
  },
  {
    value: 3,
    displayValue: '3',
    suffix: ' meses',
    label: 'Servicio de Postventa',
    description: 'Te acompañamos: atención directa de fábrica durante los 3 meses siguientes a la entrega',
    badge: 'Garantía Total'
  }
];

