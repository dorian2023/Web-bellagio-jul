'use client';

/**
 * @file ColorVariantSelector.tsx
 * @description Selector compacto y refinado de colores reales del producto (definidos en /admin).
 * Diseñado con estética Quiet Luxury: tamaño optimizado para móvil, círculos puros sin texto invasivo,
 * y área táctil cómoda (40px touch-hitbox) para máxima facilidad de uso con el pulgar.
 */

import React from 'react';
import { ProductColorVariant } from '@/src/types/catalog';
import { sanitizeHexColor } from '@/src/data/color-presets';

interface ColorVariantSelectorProps {
  variants: ProductColorVariant[];
  selectedId: string | null;
  onSelect: (variant: ProductColorVariant) => void;
}

export default function ColorVariantSelector({ variants, selectedId, onSelect }: ColorVariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <div className="color-variant-selector-card" aria-label="Colores disponibles">
      <div className="color-variant-selector-header">
        <div className="color-variant-selector-label-group">
          <svg 
            width="13" 
            height="13" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="color-variant-icon" 
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m4.93 4.93 4.24 4.24" />
            <path d="m14.83 9.17 4.24-4.24" />
            <path d="m14.83 14.83 4.24 4.24" />
            <path d="m9.17 14.83-4.24 4.24" />
          </svg>
          <span className="color-variant-selector-title">Colores Disponibles</span>
        </div>
        <span className="color-variant-selector-count">
          {variants.length} {variants.length === 1 ? 'color' : 'colores'}
        </span>
      </div>

      <div className="color-variant-list" role="radiogroup" aria-label="Color del mueble">
        {variants.map((variant) => {
          const isActive = variant.id === selectedId;
          const bg = sanitizeHexColor(variant.hexColor);
          return (
            <button
              key={variant.id}
              id={`color-variant-${variant.id}`}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`color-variant-circle-btn ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelect(variant)}
              title={variant.name}
              aria-label={variant.name}
            >
              <span
                className="color-variant-circle-fill"
                style={{ backgroundColor: bg }}
              />
              {isActive && (
                <span className="color-variant-check" aria-hidden="true">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
