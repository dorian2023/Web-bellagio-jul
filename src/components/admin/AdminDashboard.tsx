'use client';

/**
 * @file AdminDashboard.tsx
 * @description Panel administrativo autenticado para gestión de catálogo, fotos y variantes de color.
 * Se carga de forma diferida (Dynamic Code Splitting) únicamente cuando el usuario tiene sesión válida.
 */

import React, { useState, useEffect } from 'react';
import { fetchAdminProducts, saveProduct, deleteProduct, uploadProductImage } from '@/src/lib/supabase';
import { CATEGORIES_DATA } from '@/src/data/catalogs';
import { VenezuelaFlagIcon, ImportedGlobeIcon } from '@/src/components/shared/FlagIcons';
import ColorVariantsManager from '@/src/components/admin/ColorVariantsManager';
import { GalleryItem, ColorVariantDraft } from '@/src/types/admin';
import { ProductColorVariant } from '@/src/types/catalog';
import { sanitizeHexColor } from '@/src/data/color-presets';

interface AdminDashboardProps {
  session: any;
  onLogout: () => void;
}

export default function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Product Form Data
  const [formData, setFormData] = useState<{
    title: string;
    category: string;
    origin: 'nacional' | 'importado';
    stockStatus: 'disponible' | 'agotado';
    description: string;
    materials: string;
    dimensions: string;
    availableColors: string;
    youtubeUrl: string;
    published: boolean;
  }>({
    title: '',
    category: 'sofas',
    origin: 'nacional',
    stockStatus: 'disponible',
    description: '',
    materials: '',
    dimensions: '',
    availableColors: '',
    youtubeUrl: '',
    published: true
  });

  // Gallery items state (holds existing URLs & newly selected files)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Colores con fotos reales propias (ej. "Bipiel Negro" = galería principal, "Rosado" = 3 fotos)
  const [colorVariants, setColorVariants] = useState<ColorVariantDraft[]>([]);

  const loadProducts = async () => {
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Error cargando productos de admin:', err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'sofas',
      origin: 'nacional',
      stockStatus: 'disponible',
      description: '',
      materials: '',
      dimensions: '',
      availableColors: '',
      youtubeUrl: '',
      published: true
    });
    setGalleryItems([]);
    setColorVariants([]);
    setUploadProgress('');
  };

  const handleEdit = (prod: any) => {
    setEditingId(prod.id);
    setFormData({
      title: prod.title,
      category: prod.category,
      origin: prod.origin || (prod.title?.toLowerCase().includes('imp') ? 'importado' : 'nacional'),
      stockStatus: prod.stockStatus || 'disponible',
      description: prod.description || '',
      materials: prod.materials || '',
      dimensions: prod.dimensions || '',
      availableColors: (prod.availableColors || []).join(', '),
      youtubeUrl: prod.youtubeUrl || '',
      published: prod.published !== false
    });

    // Populate gallery from existing product photos
    const loadedGallery: GalleryItem[] = [];
    if (prod.image) {
      loadedGallery.push({ id: `cover-${Date.now()}`, url: prod.image });
    }
    if (Array.isArray(prod.galleryImages)) {
      prod.galleryImages.forEach((imgUrl: string, idx: number) => {
        if (imgUrl && imgUrl !== prod.image && !loadedGallery.some(g => g.url === imgUrl)) {
          loadedGallery.push({ id: `gal-${idx}-${Date.now()}`, url: imgUrl });
        }
      });
    }
    setGalleryItems(loadedGallery);

    const existingVariants: ProductColorVariant[] = Array.isArray(prod.colorVariants) ? prod.colorVariants : [];
    setColorVariants(existingVariants.map((v) => ({
      id: v.id,
      name: v.name,
      hexColor: v.hexColor,
      usesMainGallery: !!v.usesMainGallery,
      items: (v.images || []).map((url, idx) => ({ id: `${v.id}-img-${idx}`, url })),
    })));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${title}" del catálogo?`)) return;
    try {
      setFeedback({ type: 'success', text: 'Eliminando producto...' });
      await deleteProduct(id);
      await loadProducts();
      setFeedback({ type: 'success', text: 'Producto eliminado correctamente.' });
    } catch (err: any) {
      setFeedback({ type: 'error', text: `Error al eliminar: ${err.message}` });
    }
  };

  const handleAddFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newItems: GalleryItem[] = Array.from(files).map((file, idx) => ({
      id: `new-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      url: URL.createObjectURL(file),
      file
    }));
    setGalleryItems(prev => [...prev, ...newItems]);
  };

  const handleRemoveImage = (index: number) => {
    setGalleryItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetAsCover = (index: number) => {
    if (index === 0) return;
    setGalleryItems(prev => {
      const copy = [...prev];
      const [target] = copy.splice(index, 1);
      copy.unshift(target);
      return copy;
    });
  };

  const handleMoveImage = (index: number, direction: 'up' | 'down') => {
    setGalleryItems(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (galleryItems.length === 0) {
      setFeedback({ type: 'error', text: 'Debes añadir al menos una foto (Portada) para el producto.' });
      return;
    }

    setIsSubmitting(true);
    setFeedback({ type: 'success', text: 'Procesando y guardando producto...' });

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < galleryItems.length; i++) {
        const item = galleryItems[i];
        if (item.file) {
          setUploadProgress(`Subiendo foto ${i + 1} de ${galleryItems.length}...`);
          const uploadedUrl = await uploadProductImage(item.file);
          uploadedUrls.push(uploadedUrl);
        } else {
          uploadedUrls.push(item.url);
        }
      }

      const finalMainImage = uploadedUrls[0];
      const finalGalleryImages = uploadedUrls;

      // Subir fotos de cada color. Se descartan colores sin nombre o sin fotos (excepto el de la galería principal).
      const finalColorVariants: ProductColorVariant[] = [];
      for (const variant of colorVariants) {
        const name = variant.name.trim().slice(0, 60);
        if (!name) continue;
        const images: string[] = [];
        if (!variant.usesMainGallery) {
          for (let i = 0; i < variant.items.length; i++) {
            const item = variant.items[i];
            if (item.file) {
              setUploadProgress(`Subiendo fotos de "${name}" (${i + 1} de ${variant.items.length})...`);
              images.push(await uploadProductImage(item.file));
            } else {
              images.push(item.url);
            }
          }
          if (images.length === 0) continue;
        }
        finalColorVariants.push({
          id: variant.id,
          name,
          hexColor: sanitizeHexColor(variant.hexColor),
          images,
          usesMainGallery: variant.usesMainGallery,
        });
      }

      setUploadProgress('Guardando datos en la base de datos...');

      const payload = {
        title: formData.title,
        category: formData.category,
        origin: formData.origin || 'nacional',
        stockStatus: formData.stockStatus || 'disponible',
        description: formData.description,
        materials: formData.materials,
        dimensions: formData.dimensions,
        availableColors: formData.availableColors.split(',').map(c => c.trim()).filter(Boolean),
        youtubeUrl: formData.youtubeUrl,
        image: finalMainImage,
        galleryImages: finalGalleryImages,
        colorVariants: finalColorVariants,
        published: formData.published
      };

      await saveProduct(payload, editingId);
      await loadProducts();
      resetForm();
      setFeedback({
        type: 'success',
        text: editingId ? '¡Producto actualizado con éxito con su galería!' : '¡Producto creado con éxito con sus fotos en diferentes ángulos!'
      });
    } catch (err: any) {
      setFeedback({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  const filteredProducts = products.filter(p => {
    const q = searchTerm.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q);
  });

  return (
    <div className="section-wrapper" style={{ minHeight: '85vh', paddingTop: 'calc(70px + var(--space-8))' }}>
      <div className="container">
        {/* Header with Logout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <span className="section-tag">Administración de Catálogo</span>
            <h1 className="section-title" style={{ fontSize: '2rem', margin: 0 }}>
              Gestión de <span className="gold-text">Productos & Fotos</span>
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              {session.user.email}
            </span>
            <button type="button" onClick={onLogout} className="btn btn-secondary btn-sm">
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div style={{ 
            padding: 'var(--space-4)', 
            marginBottom: 'var(--space-6)',
            borderRadius: 'var(--radius-md)', 
            background: feedback.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${feedback.type === 'success' ? '#22c55e' : '#ef4444'}`,
            color: feedback.type === 'success' ? '#4ade80' : '#f87171'
          }}>
            {feedback.text}
          </div>
        )}

        {/* Admin Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
          
          {/* Left Column: Create / Edit Form */}
          <div className="luxury-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                {editingId ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-secondary btn-sm">
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitProduct}>
              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Título del Producto *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Sofá Modular Chesterfield Lujo"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Categoría *</label>
                  <select 
                    className="form-input" 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES_DATA.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Disponibilidad *</label>
                  <select 
                    className="form-input" 
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as any })}
                  >
                    <option value="disponible">🟢 En Stock / Para Fabricar</option>
                    <option value="agotado">🔴 Temporalmente Agotado</option>
                  </select>
                </div>
              </div>

              {/* Selector de Origen / Tipo de Fabricación */}
              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Origen / Tipo de Fabricación *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, origin: 'nacional' })}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: formData.origin === 'nacional' ? '2px solid var(--gold-400)' : '1px solid var(--color-border)',
                      background: formData.origin === 'nacional' ? 'rgba(212, 175, 55, 0.12)' : 'var(--color-bg-secondary)',
                      color: formData.origin === 'nacional' ? 'var(--gold-400)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: formData.origin === 'nacional' ? 600 : 400,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <VenezuelaFlagIcon width={20} height={15} />
                    <span>Nacional (Taller Propio)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, origin: 'importado' })}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: formData.origin === 'importado' ? '2px solid var(--gold-400)' : '1px solid var(--color-border)',
                      background: formData.origin === 'importado' ? 'rgba(212, 175, 55, 0.12)' : 'var(--color-bg-secondary)',
                      color: formData.origin === 'importado' ? 'var(--gold-400)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: formData.origin === 'importado' ? 600 : 400,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <ImportedGlobeIcon width={18} height={18} />
                    <span>Pieza Importada</span>
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px', marginBottom: 0 }}>
                  {formData.origin === 'nacional'
                    ? '★ Hecho en Caracas: Admite confección a medida exacta, elección de telas y cambios estructurales.'
                    : '★ Importado: Mueble exclusivo en medidas y acabados originales de fábrica.'}
                </p>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Descripción</label>
                <textarea 
                  className="form-input" 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre el diseño, estilo y características clave..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div className="form-group">
                  <label className="form-label">Materiales / Estructura</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.materials}
                    onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                    placeholder="Ej. Madera maciza, espuma HR, bouclé"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Medidas / Dimensiones</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="Ej. 2.40m x 0.95m x 0.85m"
                  />
                </div>
              </div>

              {/* SECCIÓN MULTI-FOTOS / GALERÍA */}
              <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Galería de Fotos ({galleryItems.length}) *</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    La 1ª foto es la Portada
                  </span>
                </label>

                {/* Dropzone / Upload button */}
                <div 
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-6)',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    marginBottom: 'var(--space-4)'
                  }}
                  onClick={() => document.getElementById('galleryInput')?.click()}
                >
                  <input 
                    type="file" 
                    id="galleryInput"
                    multiple 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    onChange={(e) => handleAddFiles(e.target.files)}
                  />
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📸</div>
                  <p style={{ margin: 0, fontWeight: 500 }}>
                    Toca aquí para seleccionar fotos (Permite varias a la vez)
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Formatos soportados: WebP, JPG, PNG
                  </span>
                </div>

                {/* Previews Grid */}
                {galleryItems.length > 0 && (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', 
                    gap: 'var(--space-3)',
                    marginTop: 'var(--space-3)'
                  }}>
                    {galleryItems.map((item, index) => {
                      const isCover = index === 0;
                      return (
                        <div 
                          key={item.id}
                          style={{
                            position: 'relative',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            aspectRatio: '1',
                            border: isCover ? '2px solid var(--gold-400)' : '1px solid var(--color-border)',
                            background: '#000'
                          }}
                        >
                          <img 
                            src={item.url} 
                            alt={`Ángulo ${index + 1}`} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />

                          {/* Badge de Portada o Número de Ángulo */}
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            background: isCover ? 'var(--gold-400)' : 'rgba(0,0,0,0.7)',
                            color: isCover ? '#000' : '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase'
                          }}>
                            {isCover ? '⭐ Portada' : `Ángulo ${index + 1}`}
                          </div>

                          {/* Botones de acción flotantes sobre cada foto */}
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.85)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '4px 6px',
                            alignItems: 'center'
                          }}>
                            {!isCover ? (
                              <button
                                type="button"
                                onClick={() => handleSetAsCover(index)}
                                title="Fijar como portada principal"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--gold-400)',
                                  fontSize: '0.7rem',
                                  cursor: 'pointer',
                                  padding: 0,
                                  fontWeight: 600
                                }}
                              >
                                ⭐ Portada
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Principal</span>
                            )}

                            <div style={{ display: 'flex', gap: '4px' }}>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(index, 'up')}
                                  title="Mover a la izquierda"
                                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}
                                >
                                  ◀
                                </button>
                              )}
                              {index < galleryItems.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(index, 'down')}
                                  title="Mover a la derecha"
                                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.75rem' }}
                                >
                                  ▶
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                title="Eliminar foto"
                                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Colores con fotos reales propias: Disponible para fabricación nacional e importados */}
              <ColorVariantsManager variants={colorVariants} onChange={setColorVariants} />

              {formData.origin === 'importado' && (
                <div style={{
                  marginBottom: 'var(--space-4)',
                  padding: 'var(--space-3) var(--space-4)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(212, 175, 55, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <ImportedGlobeIcon width={18} height={18} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    <strong style={{ color: 'var(--gold-400)' }}>Producto Importado:</strong> Si este modelo viene de fábrica en varios colores (ej. negro, beige, marrón), puedes asignarle a cada color sus fotos reales aquí arriba.
                  </span>
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Video de YouTube (Opcional)</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="publishedCheck"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <label htmlFor="publishedCheck" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
                  Publicar en el catálogo público
                </label>
              </div>

              {uploadProgress && (
                <div style={{ marginBottom: 'var(--space-4)', fontSize: '0.85rem', color: 'var(--gold-400)', fontWeight: 500 }}>
                  ⏳ {uploadProgress}
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : (editingId ? 'Guardar Cambios' : 'Crear y Publicar Producto')}
              </button>
            </form>
          </div>

          {/* Right Column: Existing Products List & Quick Search */}
          <div className="luxury-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>
                Catálogo Actual ({products.length})
              </h2>
              <input 
                type="text" 
                placeholder="Buscar por nombre..." 
                className="form-input" 
                style={{ maxWidth: '200px', fontSize: '0.85rem', padding: 'var(--space-2) var(--space-3)' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ maxHeight: '720px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {filteredProducts.length === 0 ? (
                <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: 'var(--space-6)' }}>
                  No se encontraron productos coincidentes.
                </p>
              ) : (
                filteredProducts.map((p) => {
                  const galleryCount = (p.galleryImages || []).length;
                  return (
                    <div 
                      key={p.id} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(255, 255, 255, 0.01)',
                        gap: 'var(--space-3)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0, background: '#111' }}>
                          <img 
                            src={p.image || '/images/hero-poster.webp'} 
                            alt={p.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          {galleryCount > 1 && (
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              background: 'rgba(0,0,0,0.8)',
                              color: 'var(--gold-400)',
                              fontSize: '0.6rem',
                              fontWeight: 700,
                              padding: '1px 3px'
                            }}>
                              +{galleryCount - 1}
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{p.title}</h4>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)' }}>
                              {p.categoryName}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>•</span>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              color: p.origin === 'importado' ? '#60a5fa' : 'var(--gold-300)'
                            }}>
                              {p.origin === 'importado' ? (
                                <>
                                  <ImportedGlobeIcon width={12} height={12} />
                                  <span>Importado</span>
                                </>
                              ) : (
                                <>
                                  <VenezuelaFlagIcon width={13} height={9} />
                                  <span>Nacional</span>
                                </>
                              )}
                            </span>
                            {p.stockStatus === 'agotado' && (
                              <span style={{ fontSize: '0.65rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '1px 5px', borderRadius: '3px' }}>
                                Agotado
                              </span>
                            )}
                            {p.published === false && (
                              <span style={{ fontSize: '0.65rem', background: 'rgba(255, 255, 255, 0.1)', color: '#aaa', padding: '1px 5px', borderRadius: '3px' }}>
                                Borrador
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button 
                          type="button" 
                          onClick={() => handleEdit(p)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: 'var(--space-2) var(--space-3)', fontSize: '0.8rem' }}
                        >
                          Editar
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleDelete(p.id, p.title)}
                          className="btn btn-sm"
                          style={{ 
                            padding: 'var(--space-2) var(--space-3)', 
                            fontSize: '0.8rem',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.3)'
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
