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
}

export const STATS_DATA: StatItem[] = [
  {
    value: 15,
    displayValue: '15',
    suffix: '+',
    label: 'Años de Trayectoria',
    description: 'Liderando el diseño de muebles de alta gama en Venezuela'
  },
  {
    value: 100,
    displayValue: '100',
    suffix: '%',
    label: 'Diseño Exclusivo',
    description: 'Showrooms y colecciones de autor para espacios únicos'
  },
  {
    value: 10000,
    displayValue: '10.000',
    suffix: '+',
    label: 'Espacios Transformados',
    description: 'Hogares, oficinas y proyectos residenciales en Caracas'
  },
  {
    value: 100,
    displayValue: '100',
    suffix: '%',
    label: 'Garantía & Calidad',
    description: 'Materiales de primera y asesoría personalizada'
  }
];
