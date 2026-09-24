'use client';

import React, { useState, useEffect } from 'react';
import { supabase, fetchAdminProducts, saveProduct, deleteProduct, uploadProductImage } from '@/src/lib/supabase';
import { CATEGORIES_DATA } from '@/src/data/catalogs';

interface GalleryItem {
  id: string;
  url: string;
  file?: File;
}

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // Product Form Data
  const [formData, setFormData] = useState({
    title: '',
    category: 'sofas',
    description: '',
    materials: '',
    dimensions: '',
    availableColors: '',
    youtubeUrl: '',
    published: true
  });

  // Gallery items state (holds existing URLs & newly selected files)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  // Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (session) {
        loadProducts();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadProducts();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (err: any) {
      console.error('Error cargando productos de admin:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'sofas',
      description: '',
      materials: '',
      dimensions: '',
      availableColors: '',
      youtubeUrl: '',
      published: true
    });
    setGalleryItems([]);
    setUploadProgress('');
  };

  const handleEdit = (prod: any) => {
    setEditingId(prod.id);
    setFormData({
      title: prod.title,
      category: prod.category,
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

      setUploadProgress('Guardando datos en la base de datos...');
      const finalMainImage = uploadedUrls[0];
      const finalGalleryImages = uploadedUrls;

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        materials: formData.materials,
        dimensions: formData.dimensions,
        availableColors: formData.availableColors.split(',').map(c => c.trim()).filter(Boolean),
        youtubeUrl: formData.youtubeUrl,
        image: finalMainImage,
        galleryImages: finalGalleryImages,
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

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="gold-text" style={{ fontSize: '1.2rem' }}>Cargando panel Bellagio...</p>
      </div>
    );
  }

  // Login View
  if (!session) {
    return (
      <div className="section-wrapper" style={{ minHeight: '80vh', paddingTop: 'calc(70px + var(--space-12))' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div className="luxury-card" style={{ padding: 'var(--space-8)' }}>
            <span className="section-tag" style={{ display: 'block', textAlign: 'center', marginBottom: 'var(--space-2)' }}>
              Acceso Restringido
            </span>
            <h1 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: 'var(--space-4)' }}>
              Panel de Administración
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: '0.9rem' }}>
              Inicia sesión con tu cuenta de administrador de Muebles Bellagio para gestionar catálogo, fotos e inventario.
            </p>

            {authError && (
              <div style={{ padding: 'var(--space-3)', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)', fontSize: '0.85rem' }}>
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  className="form-input" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mueblesbellagio.com"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                <label className="form-label">Contraseña</label>
                <input 
                  type="password" 
                  className="form-input" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Entrar al Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
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
            <button type="button" onClick={handleLogout} className="btn btn-secondary btn-sm">
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
          
          {/* Form Section */}
          <section className="luxury-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontSize: '1.3rem' }}>{editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn btn-secondary btn-sm">
                  Cancelar Edición
                </button>
              )}
            </div>

            <form onSubmit={handleSubmitProduct}>
              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Nombre del Mueble *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej. Sofá Seccional Bellagio Imperiale"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Categoría *</label>
                <select 
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES_DATA.filter(c => c.id !== 'todos').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Descripción</label>
                <textarea 
                  className="form-input" 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles sobre diseño, confort y acabados..."
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Materiales Nobles</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  placeholder="Ej. Mármol Calacatta, Roble macizo, Piel italiana"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Medidas / Dimensiones</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="Ej. 260 cm x 120 cm x 76 cm"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Tonos / Acabados (Separados por coma)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={formData.availableColors}
                  onChange={(e) => setFormData({ ...formData, availableColors: e.target.value })}
                  placeholder="Ej. Champagne, Nogal, Negro Marquina"
                />
              </div>

              {/* Multi-Photo Gallery & Angles Manager */}
              <div className="form-group" style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: 600 }}>
                    Galería de Fotos & Ángulos ({galleryItems.length})
                  </label>
                  <span style={{ fontSize: '0.75rem', color: 'var(--gold-400)' }}>
                    {galleryItems.length === 0 ? 'Sin fotos' : `${galleryItems.length} foto(s) registrada(s)`}
                  </span>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Sube hasta 5 o más fotos (Frontal, Lateral, Perspectiva, Detalle de Acabados, Ambiente). La primera foto será la <strong>Portada Principal</strong>.
                </p>

                {/* Upload Action Area */}
                <div style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  textAlign: 'center',
                  background: 'var(--color-bg-surface-elevated)',
                  marginBottom: '16px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="file"
                    id="gallery-file-input"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleAddFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                  <label htmlFor="gallery-file-input" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: 'var(--gold-400)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem'
                    }}>
                      ➕
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      Toca aquí para seleccionar fotos (Permite varias a la vez)
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Formatos soportados: WebP, JPG, PNG
                    </span>
                  </label>
                </div>

                {/* Gallery Items Grid Preview */}
                {galleryItems.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    {galleryItems.map((item, index) => {
                      const isCover = index === 0;
                      return (
                        <div
                          key={item.id}
                          style={{
                            position: 'relative',
                            background: 'var(--color-bg-surface-elevated)',
                            borderRadius: 'var(--radius-sm)',
                            overflow: 'hidden',
                            border: isCover ? '2px solid var(--gold-400)' : '1px solid var(--color-border)',
                            boxShadow: isCover ? '0 0 10px rgba(212, 175, 55, 0.25)' : 'none',
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          {/* Badge */}
                          <div style={{
                            position: 'absolute',
                            top: '4px',
                            left: '4px',
                            zIndex: 2,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            background: isCover ? 'var(--gold-400)' : 'rgba(0,0,0,0.75)',
                            color: isCover ? '#000' : '#fff'
                          }}>
                            {isCover ? '⭐ Portada' : `Ángulo ${index + 1}`}
                          </div>

                          {/* Image Preview */}
                          <div style={{ width: '100%', height: '95px', overflow: 'hidden', position: 'relative' }}>
                            <img
                              src={item.url}
                              alt={`Ángulo ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {item.file && (
                              <span style={{
                                position: 'absolute',
                                bottom: '4px',
                                right: '4px',
                                background: 'rgba(34, 197, 94, 0.9)',
                                color: '#fff',
                                fontSize: '0.6rem',
                                padding: '1px 4px',
                                borderRadius: '3px'
                              }}>
                                Nuevo
                              </span>
                            )}
                          </div>

                          {/* Controls */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '4px',
                            background: 'rgba(0,0,0,0.4)',
                            gap: '2px'
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
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  padding: '2px 4px'
                                }}
                              >
                                ⭐ Portada
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.65rem', color: 'var(--gold-400)', padding: '2px 4px' }}>Principal</span>
                            )}

                            <div style={{ display: 'flex', gap: '2px' }}>
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(index, 'up')}
                                  title="Mover hacia la izquierda"
                                  style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '0.7rem',
                                    borderRadius: '3px',
                                    padding: '2px 4px'
                                  }}
                                >
                                  ◀
                                </button>
                              )}
                              {index < galleryItems.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(index, 'down')}
                                  title="Mover hacia la derecha"
                                  style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontSize: '0.7rem',
                                    borderRadius: '3px',
                                    padding: '2px 4px'
                                  }}
                                >
                                  ▶
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                title="Eliminar foto"
                                style={{
                                  background: 'rgba(239, 68, 68, 0.2)',
                                  border: 'none',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem',
                                  borderRadius: '3px',
                                  padding: '2px 4px'
                                }}
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

              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isSubmitting ? (uploadProgress || 'Guardando en Supabase...') : (editingId ? 'Guardar Cambios' : 'Crear y Publicar Producto')}
              </button>
            </form>
          </section>

          {/* Inventory List Section */}
          <section className="luxury-card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <div>
                <span className="section-tag">Base de Datos</span>
                <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Inventario de Muebles</h2>
              </div>
              <span className="gold-text" style={{ fontWeight: 700 }}>
                {products.length} productos
              </span>
            </div>

            {/* Search filter in admin */}
            <input 
              type="search" 
              className="form-input" 
              placeholder="Buscar producto por nombre o categoría..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 'var(--space-4)' }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '600px', overflowY: 'auto' }}>
              {filteredProducts.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-6) 0' }}>
                  No hay productos registrados en Supabase.
                </p>
              ) : (
                filteredProducts.map((prod) => {
                  const photoCount = (prod.galleryImages && prod.galleryImages.length > 0) 
                    ? prod.galleryImages.length 
                    : (prod.image ? 1 : 0);
                  return (
                    <article key={prod.id} style={{ 
                      display: 'flex', 
                      gap: '12px', 
                      alignItems: 'center', 
                      padding: 'var(--space-3)', 
                      background: 'var(--color-bg-surface-elevated)', 
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)'
                    }}>
                      <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                        <img 
                          src={prod.image} 
                          alt={prod.title} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                        />
                        {photoCount > 1 && (
                          <span style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            background: 'rgba(0,0,0,0.8)',
                            color: 'var(--gold-400)',
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            padding: '1px 3px',
                            borderRadius: '3px'
                          }}>
                            📷 {photoCount}
                          </span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {prod.title}
                        </strong>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                          <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)' }}>
                            {prod.categoryName}
                          </span>
                          {photoCount > 1 && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                              • {photoCount} fotos
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          type="button" 
                          onClick={() => handleEdit(prod)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                        >
                          Editar
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleDelete(prod.id, prod.title)}
                          className="btn btn-sm"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
