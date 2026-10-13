'use client';

/**
 * @file ColorVariantSelector.tsx
 * @description Selector de colores reales del producto (definidos en /admin).
 * Al marcar un color, el modal muestra exclusivamente las fotos de ese color.
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
  const selected = variants.find((v) => v.id === selectedId) || null;

  return (
    <div className="atelier-swatch-configurator color-variant-selector" aria-label="Colores disponibles">
      <div className="atelier-swatch-header">
        <div className="atelier-swatch-title-wrap">
          <span className="atelier-swatch-badge">
            <span>Colores Disponibles</span>
          </span>
          <h4 className="atelier-swatch-heading">Elige tu Color</h4>
        </div>
        <span className="atelier-swatch-count-pill">
          {variants.length} {variants.length === 1 ? 'color' : 'colores'}
        </span>
      </div>

      <div className="color-variant-list" role="radiogroup" aria-label="Color del mueble">
        {variants.map((variant) => {
          const isActive = variant.id === selectedId;
          return (
            <button
              key={variant.id}
              id={`color-variant-${variant.id}`}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`color-variant-option ${isActive ? 'is-active' : ''}`}
              onClick={() => onSelect(variant)}
              title={variant.name}
            >
              <span
                className="color-variant-dot"
                style={{ backgroundColor: sanitizeHexColor(variant.hexColor) }}
                aria-hidden="true"
              />
              <span className="color-variant-name">{variant.name}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="color-variant-status">
          Viendo fotos reales en <strong>{selected.name}</strong>
        </p>
      )}
    </div>
  );
}
