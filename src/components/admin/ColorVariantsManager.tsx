'use client';

/**
 * @file ColorVariantsManager.tsx
 * @description Gestor de "Colores con fotos reales" en /admin.
 *
 * Flujo de negocio:
 * 1. (Opcional) Indicar de qué color son las fotos de la galería principal (ej. "Bipiel Negro").
 * 2. Agregar otros colores (ej. "Rosado") y subir SOLO las fotos del mueble en ese color.
 * En el catálogo, al marcar un color, el cliente ve exclusivamente las fotos de ese color.
 */

import React, { useState } from 'react';
import { ColorVariantDraft, GalleryItem } from '@/src/types/admin';
import { sanitizeHexColor } from '@/src/data/color-presets';
import ColorPresetPicker from './ColorPresetPicker';
import styles from './ColorVariantsManager.module.css';

interface ColorVariantsManagerProps {
  variants: ColorVariantDraft[];
  onChange: (variants: ColorVariantDraft[]) => void;
}

type PickerMode = null | 'primary' | 'variant';

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

export default function ColorVariantsManager({ variants, onChange }: ColorVariantsManagerProps) {
  const [pickerMode, setPickerMode] = useState<PickerMode>(null);

  const primary = variants.find((v) => v.usesMainGallery) || null;
  const extraVariants = variants.filter((v) => !v.usesMainGallery);
  const usedNames = variants.map((v) => v.name);

  const updateVariant = (id: string, patch: Partial<ColorVariantDraft>) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  };

  const removeVariant = (id: string) => {
    const target = variants.find((v) => v.id === id);
    if (target && target.items.length > 0 &&
      !window.confirm(`¿Quitar el color "${target.name}" y sus ${target.items.length} foto(s)?`)) return;
    onChange(variants.filter((v) => v.id !== id));
  };

  const handlePick = (color: { name: string; hexColor: string }) => {
    if (pickerMode === 'primary') {
      const withoutPrimary = variants.filter((v) => !v.usesMainGallery);
      onChange([{ id: createId('color'), ...color, usesMainGallery: true, items: [] }, ...withoutPrimary]);
    } else if (pickerMode === 'variant') {
      onChange([...variants, { id: createId('color'), ...color, usesMainGallery: false, items: [] }]);
    }
    setPickerMode(null);
  };

  const addFiles = (variantId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const target = variants.find((v) => v.id === variantId);
    if (!target) return;
    const newItems: GalleryItem[] = Array.from(files).map((file) => ({
      id: createId('vimg'),
      url: URL.createObjectURL(file),
      file,
    }));
    updateVariant(variantId, { items: [...target.items, ...newItems] });
  };

  const removeImage = (variantId: string, imageId: string) => {
    const target = variants.find((v) => v.id === variantId);
    if (!target) return;
    updateVariant(variantId, { items: target.items.filter((i) => i.id !== imageId) });
  };

  const moveImage = (variantId: string, index: number, delta: -1 | 1) => {
    const target = variants.find((v) => v.id === variantId);
    if (!target) return;
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= target.items.length) return;
    const items = [...target.items];
    [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
    updateVariant(variantId, { items });
  };

  return (
    <div className={styles.manager}>
      <div className={styles.header}>
        <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
          Colores con Fotos Reales ({variants.length})
        </label>
        <span className={styles.badge}>Opcional</span>
      </div>
      <p className={styles.hint}>
        Si este mueble se fabrica en varios colores, asigna a cada color sus propias fotos.
        Cuando el cliente marque un color, verá <strong>solo las fotos de ese color</strong>.
        Si no agregas colores, se muestran los muestrarios de tela generales.
      </p>

      {/* Paso 1: color de la galería principal */}
      <div className={styles.step}>
        <span className={styles.stepNumber}>1</span>
        <div className={styles.stepBody}>
          <p className={styles.stepTitle}>¿De qué color son las fotos de la galería principal?</p>
          {primary ? (
            <div className={styles.primaryRow}>
              <span className={styles.dotLarge} style={{ backgroundColor: sanitizeHexColor(primary.hexColor) }} />
              <input
                type="text"
                className="form-input"
                aria-label="Nombre del color principal"
                value={primary.name}
                maxLength={60}
                onChange={(e) => updateVariant(primary.id, { name: e.target.value })}
              />
              <input
                type="color"
                aria-label="Tono del color principal"
                className={styles.colorInput}
                value={sanitizeHexColor(primary.hexColor)}
                onChange={(e) => updateVariant(primary.id, { hexColor: e.target.value })}
              />
              <button type="button" className={styles.dangerButton} onClick={() => removeVariant(primary.id)}>
                Quitar
              </button>
            </div>
          ) : (
            <button type="button" className={styles.secondaryButton} onClick={() => setPickerMode('primary')}>
              Elegir color de las fotos principales
            </button>
          )}
        </div>
      </div>

      {/* Paso 2: colores adicionales con sus fotos */}
      <div className={styles.step}>
        <span className={styles.stepNumber}>2</span>
        <div className={styles.stepBody}>
          <p className={styles.stepTitle}>Otros colores y sus fotos</p>

          {extraVariants.map((variant) => {
            const inputId = `variant-files-${variant.id}`;
            return (
              <div key={variant.id} className={styles.variantCard}>
                <div className={styles.variantHeader}>
                  <span className={styles.dotLarge} style={{ backgroundColor: sanitizeHexColor(variant.hexColor) }} />
                  <input
                    type="text"
                    className="form-input"
                    aria-label="Nombre del color"
                    value={variant.name}
                    maxLength={60}
                    onChange={(e) => updateVariant(variant.id, { name: e.target.value })}
                  />
                  <input
                    type="color"
                    aria-label="Tono del color"
                    className={styles.colorInput}
                    value={sanitizeHexColor(variant.hexColor)}
                    onChange={(e) => updateVariant(variant.id, { hexColor: e.target.value })}
                  />
                  <button type="button" className={styles.dangerButton} onClick={() => removeVariant(variant.id)}>
                    Quitar
                  </button>
                </div>

                <input
                  id={inputId}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    addFiles(variant.id, e.target.files);
                    e.target.value = '';
                  }}
                />
                <label htmlFor={inputId} className={styles.uploadArea}>
                  ➕ Subir fotos del mueble en <strong>{variant.name || 'este color'}</strong>
                </label>

                {variant.items.length === 0 ? (
                  <p className={styles.warning}>⚠ Sin fotos: este color no aparecerá en el catálogo hasta que subas al menos una.</p>
                ) : (
                  <div className={styles.thumbGrid}>
                    {variant.items.map((item, index) => (
                      <div key={item.id} className={styles.thumb}>
                        <img src={item.url} alt={`${variant.name} foto ${index + 1}`} />
                        {index === 0 && <span className={styles.thumbBadge}>Principal</span>}
                        {item.file && <span className={styles.thumbNew}>Nuevo</span>}
                        <div className={styles.thumbControls}>
                          <button type="button" onClick={() => moveImage(variant.id, index, -1)} disabled={index === 0} aria-label="Mover a la izquierda">◀</button>
                          <button type="button" onClick={() => moveImage(variant.id, index, 1)} disabled={index === variant.items.length - 1} aria-label="Mover a la derecha">▶</button>
                          <button type="button" className={styles.thumbDelete} onClick={() => removeImage(variant.id, item.id)} aria-label="Eliminar foto">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <button type="button" className={styles.secondaryButton} onClick={() => setPickerMode('variant')}>
            + Agregar color con sus fotos
          </button>
        </div>
      </div>

      {pickerMode && (
        <ColorPresetPicker
          title={pickerMode === 'primary' ? 'Color de las fotos principales' : 'Nuevo color'}
          excludedNames={usedNames}
          onPick={handlePick}
          onCancel={() => setPickerMode(null)}
        />
      )}
    </div>
  );
}
