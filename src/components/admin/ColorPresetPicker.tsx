'use client';

/**
 * @file ColorPresetPicker.tsx
 * @description Buscador de colores para el admin: escribe "rosado" y elige el tono,
 * o crea un color personalizado con su propio nombre y selector HEX.
 */

import React, { useMemo, useState } from 'react';
import { searchColorPresets, sanitizeHexColor } from '@/src/data/color-presets';
import styles from './ColorVariantsManager.module.css';

interface ColorPresetPickerProps {
  title: string;
  excludedNames: string[];
  onPick: (color: { name: string; hexColor: string }) => void;
  onCancel: () => void;
}

export default function ColorPresetPicker({ title, excludedNames, onPick, onCancel }: ColorPresetPickerProps) {
  const [query, setQuery] = useState('');
  const [customHex, setCustomHex] = useState('#E8B4C0');

  const excluded = useMemo(() => new Set(excludedNames.map((n) => n.toLowerCase())), [excludedNames]);
  const results = useMemo(
    () => searchColorPresets(query).filter((p) => !excluded.has(p.name.toLowerCase())),
    [query, excluded]
  );
  const trimmedQuery = query.trim();
  const canCreateCustom = trimmedQuery.length > 1 && !excluded.has(trimmedQuery.toLowerCase());

  return (
    <div className={styles.picker} role="dialog" aria-label={title}>
      <div className={styles.pickerHeader}>
        <strong>{title}</strong>
        <button type="button" className={styles.linkButton} onClick={onCancel}>Cancelar</button>
      </div>

      <input
        id="color-preset-search"
        type="search"
        className="form-input"
        autoFocus
        placeholder='Busca un color: "rosado", "negro", "azul"...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className={styles.presetGrid}>
        {results.map((preset) => (
          <button
            key={preset.name}
            type="button"
            className={styles.presetChip}
            onClick={() => onPick({ name: preset.name, hexColor: preset.hexColor })}
          >
            <span className={styles.dot} style={{ backgroundColor: preset.hexColor }} aria-hidden="true" />
            {preset.name}
          </button>
        ))}
        {results.length === 0 && (
          <p className={styles.hint}>No hay colores con ese nombre. Créalo como personalizado abajo.</p>
        )}
      </div>

      {canCreateCustom && (
        <div className={styles.customRow}>
          <input
            type="color"
            aria-label="Tono del color personalizado"
            value={customHex}
            onChange={(e) => setCustomHex(e.target.value)}
            className={styles.colorInput}
          />
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => onPick({ name: trimmedQuery.slice(0, 60), hexColor: sanitizeHexColor(customHex) })}
          >
            Crear color “{trimmedQuery}”
          </button>
        </div>
      )}
    </div>
  );
}
