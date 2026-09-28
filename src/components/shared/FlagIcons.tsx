import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🇻🇪 Official Venezuela Flag Vector (Yellow, Blue, Red stripes with 8 stars)
 * Renders a crisp real visual flag on any operating system (Windows, Mac, iOS, Android).
 */
export function VenezuelaFlagIcon({ width = 18, height = 12, className = '', style = {} }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 900 600"
      width={width}
      height={height}
      className={className}
      aria-label="Bandera de Venezuela"
      style={{
        borderRadius: '2px',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
        ...style
      }}
    >
      {/* Amarillo */}
      <rect width="900" height="200" fill="#FFCC00" />
      {/* Azul */}
      <rect y="200" width="900" height="200" fill="#00247D" />
      {/* Rojo */}
      <rect y="400" width="900" height="200" fill="#CF142B" />

      {/* 8 Estrellas en arco */}
      <g fill="#FFFFFF" transform="translate(450, 350)">
        {[-65, -46, -27, -9, 9, 27, 46, 65].map((angle, i) => {
          const rad = (angle - 90) * (Math.PI / 180);
          const cx = Math.cos(rad) * 105;
          const cy = Math.sin(rad) * 105;
          return (
            <polygon
              key={i}
              transform={`translate(${cx.toFixed(2)}, ${cy.toFixed(2)})`}
              points="0,-11 3.4,-3.4 11,-3.4 4.8,0.8 7.2,8 0,3.5 -7.2,8 -4.8,0.8 -11,-3.4 -3.4,-3.4"
            />
          );
        })}
      </g>
    </svg>
  );
}

/**
 * 🌍 Globe / World Icon for imported products
 */
export function ImportedGlobeIcon({ width = 16, height = 16, className = '', style = {} }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-label="Producto Importado"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style
      }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
