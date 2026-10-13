'use client';

import React, { useState } from 'react';
import { FabricColorSwatch, MaterialCatalogGroup } from '@/src/types/catalog';

interface FabricSwatchSelectorProps {
  materialCatalogs: MaterialCatalogGroup[];
  selectedColor: FabricColorSwatch | null;
  onSelectColor: (color: FabricColorSwatch) => void;
  productTitle?: string;
}

export default function FabricSwatchSelector({
  materialCatalogs,
  selectedColor,
  onSelectColor,
  productTitle = 'Mueble Bellagio'
}: FabricSwatchSelectorProps) {
  if (!materialCatalogs || materialCatalogs.length === 0) return null;

  // Active catalog tab (defaults to the catalog of the selected color, or first catalog)
  const [activeCatalogId, setActiveCatalogId] = useState<string>(() => {
    if (selectedColor?.catalogName) {
      const match = materialCatalogs.find(c => c.catalogName === selectedColor.catalogName || c.id === selectedColor.catalogName);
      if (match) return match.id;
    }
    return materialCatalogs[0]?.id || '';
  });

  const activeCatalog = materialCatalogs.find(c => c.id === activeCatalogId) || materialCatalogs[0];
  const hasMultipleCatalogs = materialCatalogs.length > 1;

  // Get texture class or texture style based on materialType
  const getTextureStyle = (type: string, hexColor?: string) => {
    const bg = hexColor || '#CCCCCC';
    switch (type) {
      case 'terciopelo':
        return {
          backgroundColor: bg,
          backgroundImage: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.28) 0%, transparent 60%), linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.12) 100%)',
          boxShadow: 'inset 0 1px 3px rgba(255,255,255,0.4), inset 0 -1px 3px rgba(0,0,0,0.3)'
        };
      case 'boucle':
        return {
          backgroundColor: bg,
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.12) 15%, transparent 20%), radial-gradient(rgba(255,255,255,0.25) 15%, transparent 20%)',
          backgroundSize: '6px 6px',
          backgroundPosition: '0 0, 3px 3px'
        };
      case 'lino':
        return {
          backgroundColor: bg,
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)'
        };
      case 'madera':
        return {
          backgroundColor: bg,
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.03) 2px, transparent 2px, transparent 8px), linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.2) 100%)'
        };
      default:
        return { backgroundColor: bg };
    }
  };

  return (
    <div className="atelier-swatch-configurator" aria-label="Configurador de Telas y Acabados Bellagio">
      <div className="atelier-swatch-header">
        <div className="atelier-swatch-title-wrap">
          <span className="atelier-swatch-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Muestrarios & Telas Oficiales</span>
          </span>
          <h4 className="atelier-swatch-heading">Personaliza tu Acabado</h4>
        </div>

        {activeCatalog && (
          <span className="atelier-swatch-count-pill">
            {activeCatalog.colors.length} tonos disponibles
          </span>
        )}
      </div>

      {/* Catalog Selector Pills (if product has multiple fabric/wood books) */}
      {hasMultipleCatalogs && (
        <div className="atelier-catalogs-tabs" role="tablist" aria-label="Líneas de Telas y Acabados">
          {materialCatalogs.map((cat) => {
            const isActive = cat.id === activeCatalogId;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`atelier-catalog-tab-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  setActiveCatalogId(cat.id);
                  // Optionally auto-select the first color in this catalog if current isn't in it
                  if (cat.colors && cat.colors.length > 0 && selectedColor?.catalogName !== cat.catalogName) {
                    onSelectColor(cat.colors[0]);
                  }
                }}
              >
                <span>{cat.catalogName}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Description of the active catalog */}
      {activeCatalog?.description && (
        <p className="atelier-catalog-desc">
          {activeCatalog.description}
        </p>
      )}

      {/* Swatches Matrix */}
      <div className="atelier-swatches-grid" role="radiogroup" aria-label={`Colores disponibles en ${activeCatalog?.catalogName || 'este producto'}`}>
        {activeCatalog?.colors.map((color) => {
          const isSelected = selectedColor?.id === color.id;
          const textureStyle = getTextureStyle(activeCatalog.materialType, color.hexColor);

          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Elegir ${color.name}`}
              className={`atelier-swatch-item ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelectColor(color)}
              title={`${color.name} (${activeCatalog.catalogName})`}
            >
              <div 
                className="atelier-swatch-circle" 
                style={textureStyle}
              >
                {color.swatchImage && (
                  <img 
                    src={color.swatchImage} 
                    alt={color.name} 
                    className="atelier-swatch-img"
                    loading="lazy" 
                  />
                )}
                {isSelected && (
                  <div className="atelier-swatch-check" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Tooltip on hover */}
              <div className="atelier-swatch-tooltip" aria-hidden="true">
                <span className="tooltip-color-name">{color.name}</span>
                {color.code && <span className="tooltip-code">Cód: {color.code}</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Live Selection Indicator Box (Opción 1: Muestrario de Showroom para Confección a Medida) */}
      <div className="atelier-selection-status-card">
        <div className="status-indicator-left">
          <div 
            className="status-preview-dot" 
            style={selectedColor ? getTextureStyle(activeCatalog.materialType, selectedColor.hexColor) : { backgroundColor: '#C5A55A' }}
          />
          <div className="status-text-wrap">
            <span className="status-caption">Acabado Seleccionado para Cotización:</span>
            <strong className="status-name">
              {selectedColor ? selectedColor.name : 'Selecciona una tonalidad'}
            </strong>
            <span className="status-subnote">
              Confección personalizada a medida en Taller Bellagio
            </span>
          </div>
        </div>

        <div className="status-pill-badge">
          <span>Telas Showroom</span>
        </div>
      </div>
    </div>
  );
}
