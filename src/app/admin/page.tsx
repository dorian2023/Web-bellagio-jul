'use client';

/**
 * @file page.tsx (Admin Root)
 * @description Punto de entrada a la sección administrativa de Muebles Bellagio.
 * Aplica Dynamic Code Splitting para servir únicamente el formulario ligero de login a usuarios no autenticados,
 * y cargar bajo demanda el panel completo (AdminDashboard) solo cuando la sesión está activa y verificada.
 */

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/src/lib/supabase';

// Carga diferida en el cliente: el código del dashboard no se descarga hasta iniciar sesión
const AdminDashboard = dynamic(() => import('@/src/components/admin/AdminDashboard'), {
  loading: () => (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p className="gold-text" style={{ fontSize: '1.2rem' }}>Cargando panel Bellagio...</p>
    </div>
  ),
  ssr: false,
});

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setAuthError('Credenciales incorrectas. Verifica que tu correo y contraseña coincidan con tu usuario en Supabase.');
        } else if (error.message.includes('Email not confirmed')) {
          setAuthError('El correo electrónico no ha sido confirmado aún en Supabase.');
        } else {
          setAuthError(`Error de autenticación: ${error.message}`);
        }
      }
    } catch (err: any) {
      setAuthError(`Error de conexión con Supabase: ${err?.message || 'Error desconocido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="gold-text" style={{ fontSize: '1.2rem' }}>Cargando panel Bellagio...</p>
      </div>
    );
  }

  // Vista de Login: única vista descargada y renderizada para visitantes no autenticados
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

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Iniciando sesión...' : 'Entrar al Panel'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard de administración autenticado cargado bajo demanda
  return <AdminDashboard session={session} onLogout={handleLogout} />;
}
