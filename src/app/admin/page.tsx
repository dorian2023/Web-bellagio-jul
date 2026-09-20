'use client';

import React, { useState, useEffect } from 'react';
import { supabase, fetchAdminProducts, saveProduct, deleteProduct, uploadProductImage } from '@/src/lib/supabase';
import { CATEGORIES_DATA } from '@/src/data/catalogs';

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

  // Product Form Data
  const [formData, setFormData] = useState({
    title: '',
    category: 'sofas',
    description: '',
    materials: '',
    dimensions: '',
    availableColors: '',
    youtubeUrl: '',
    published: true,
    imageFile: null as File | null,
    currentImage: ''
  });

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
      published: true,
      imageFile: null,
      currentImage: ''
    });
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
      published: prod.published !== false,
      imageFile: null,
      currentImage: prod.image || ''
    });
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

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: 'success', text: 'Procesando producto...' });

    try {
      let finalImageUrl = formData.currentImage;

      // If user uploaded a new image, upload to Supabase Storage bucket
      if (formData.imageFile) {
        setFeedback({ type: 'success', text: 'Subiendo imagen a Supabase Storage...' });
        finalImageUrl = await uploadProductImage(formData.imageFile);
      }

      if (!finalImageUrl) {
        throw new Error('Debes seleccionar o adjuntar una imagen para el producto.');
      }

      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        materials: formData.materials,
        dimensions: formData.dimensions,
        availableColors: formData.availableColors.split(',').map(c => c.trim()).filter(Boolean),
        youtubeUrl: formData.youtubeUrl,
        image: finalImageUrl,
        published: formData.published
      };

      await saveProduct(payload, editingId);
      await loadProducts();
      resetForm();
      setFeedback({
        type: 'success',
        text: editingId ? '¡Producto actualizado con éxito!' : '¡Producto creado y guardado en la base de datos!'
      });
    } catch (err: any) {
      setFeedback({ type: 'error', text: `Error: ${err.message}` });
    } finally {
      setIsSubmitting(false);
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

              <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                <label className="form-label">Subir Foto Principal (JPG, PNG o WebP)</label>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp"
                  className="form-input"
                  onChange={(e) => setFormData({ ...formData, imageFile: e.target.files?.[0] || null })}
                />
                {formData.currentImage && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={formData.currentImage} alt="Preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Foto actual guardada</span>
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
                {isSubmitting ? 'Guardando en Supabase...' : (editingId ? 'Guardar Cambios' : 'Crear y Publicar Producto')}
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
                filteredProducts.map((prod) => (
                  <article key={prod.id} style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'center', 
                    padding: 'var(--space-3)', 
                    background: 'var(--color-bg-surface-elevated)', 
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <img 
                      src={prod.image} 
                      alt={prod.title} 
                      style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} 
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: 'block', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {prod.title}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gold-400)' }}>
                        {prod.categoryName}
                      </span>
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
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
