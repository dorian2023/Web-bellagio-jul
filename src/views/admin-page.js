import { fetchAdminProducts, saveProduct, deleteProduct, uploadProductImage } from '../services/products.js';
import { supabase, isSupabaseConfigured } from '../services/supabase.js';
import { CATEGORIES_DATA } from '../data/catalogs.js';
import { escapeHTML } from '../utils/security.js';
import { extractYouTubeId } from '../utils/media.js';

let adminProducts = [];
let editingProductId = null;
let isSavingProduct = false;

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 140);
}

function categoryOptions(selected = '') {
  return CATEGORIES_DATA.filter(category => category.id !== 'todos').map(category =>
    `<option value="${escapeHTML(category.id)}" ${category.id === selected ? 'selected' : ''}>${escapeHTML(category.name)}</option>`
  ).join('');
}

function productRows() {
  if (!adminProducts.length) return '<p class="admin-empty">Aún no hay productos en Supabase.</p>';
  return adminProducts.map(product => `
    <article class="admin-product-row">
      <img src="${escapeHTML(product.image)}" alt="" class="admin-product-thumb" width="72" height="56">
      <div class="admin-product-row-info">
        <strong>${escapeHTML(product.title)}</strong>
        <span>${escapeHTML(product.categoryName)} · ${product.published ? 'Publicado' : 'Borrador'}</span>
      </div>
      <div class="admin-product-row-actions">
        <button class="btn btn-secondary btn-sm" type="button" data-admin-edit="${escapeHTML(product.id)}">Editar</button>
        <button class="btn btn-outline-danger btn-sm" type="button" data-admin-delete="${escapeHTML(product.id)}">Eliminar</button>
      </div>
    </article>
  `).join('');
}

function renderPanel() {
  return `
    <div class="admin-page">
      <header class="admin-page-header">
        <div>
          <span class="section-tag">Administración privada</span>
          <h1>Gestión de catálogo</h1>
          <p>Publica y administra las piezas que aparecen en la web de Muebles Bellagio.</p>
        </div>
        <button type="button" class="btn btn-secondary" id="adminLogoutBtn">Cerrar sesión</button>
      </header>
      <div class="admin-layout">
        <section class="admin-panel" aria-labelledby="adminFormTitle">
          <div class="admin-panel-heading">
            <div>
              <span class="section-tag">Contenido</span>
              <h2 id="adminFormTitle">${editingProductId ? 'Editar producto' : 'Nuevo producto'}</h2>
            </div>
            ${editingProductId ? '<button type="button" class="btn btn-secondary btn-sm" id="adminNewProductBtn">Nuevo</button>' : ''}
          </div>
          <div id="adminFeedback" class="form-feedback" role="status"></div>
          <form id="adminProductForm" class="admin-form">
            <label>Nombre<input name="title" required maxlength="120" value="${editingProductId ? escapeHTML(adminProducts.find(p => p.id === editingProductId)?.title || '') : ''}"></label>
            <label>Categoría<select name="category" required>${categoryOptions(editingProductId ? adminProducts.find(p => p.id === editingProductId)?.category : '')}</select></label>
            <label>Descripción<textarea name="description" rows="4">${editingProductId ? escapeHTML(adminProducts.find(p => p.id === editingProductId)?.description || '') : ''}</textarea></label>
            <label>Materiales<input name="materials" value="${editingProductId ? escapeHTML(adminProducts.find(p => p.id === editingProductId)?.materials || '') : ''}"></label>
            <label>Dimensiones<input name="dimensions" value="${editingProductId ? escapeHTML(adminProducts.find(p => p.id === editingProductId)?.dimensions || '') : ''}"></label>
            <label>Colores separados por coma<input name="availableColors" value="${editingProductId ? escapeHTML((adminProducts.find(p => p.id === editingProductId)?.availableColors || []).join(', ')) : ''}"></label>
            <label>Video de YouTube<input name="youtubeUrl" type="url" placeholder="https://www.youtube.com/watch?v=..." value="${editingProductId ? escapeHTML(adminProducts.find(p => p.id === editingProductId)?.youtubeUrl || '') : ''}"><span class="admin-field-hint">Opcional. Acepta enlaces de YouTube, Shorts y youtu.be.</span></label>
            <label class="admin-image-field">Imagen principal<input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp"><span>JPG, PNG o WebP. Máximo 15 MB originales; se comprime automáticamente a WebP.</span></label>
            <label class="admin-check-field"><input name="published" type="checkbox" ${editingProductId && adminProducts.find(p => p.id === editingProductId)?.published ? 'checked' : ''}> Publicar en el catálogo</label>
            <button class="btn btn-primary" type="submit">${editingProductId ? 'Guardar cambios' : 'Crear producto'}</button>
          </form>
        </section>
        <section class="admin-panel" aria-labelledby="adminListTitle">
          <div class="admin-panel-heading"><div><span class="section-tag">Inventario</span><h2 id="adminListTitle">Productos</h2></div><span class="admin-count" id="adminProductsCount">${adminProducts.length}</span></div>
          <div id="adminProductsList" class="admin-products-list">${productRows()}</div>
        </section>
      </div>
    </div>
  `;
}

function renderLogin() {
  return `
    <div class="admin-auth-page">
      <form class="admin-auth-panel" id="adminLoginForm">
        <span class="section-tag">Acceso restringido</span>
        <h1>Panel Bellagio</h1>
        <p>Inicia sesión para gestionar el catálogo.</p>
        <div id="adminFeedback" class="form-feedback" role="alert"></div>
        <label>Correo electrónico<input name="email" type="email" autocomplete="email" required></label>
        <label>Contraseña<input name="password" type="password" autocomplete="current-password" required></label>
        <button class="btn btn-primary" type="submit">Entrar al panel</button>
      </form>
    </div>
  `;
}

function renderConfigurationRequired() {
  return `
    <div class="admin-auth-page">
      <section class="admin-auth-panel">
        <span class="section-tag">Configuración pendiente</span>
        <h1>Panel Bellagio</h1>
        <p>Agrega las variables de Supabase siguiendo <strong>SUPABASE_SETUP.md</strong> para activar el acceso administrador.</p>
        <a class="btn btn-secondary" href="#/catalogo">Volver al catálogo</a>
      </section>
    </div>
  `;
}

function showFeedback(message, type = 'error') {
  const feedback = document.getElementById('adminFeedback');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `form-feedback ${type}`;
}

function showProductCreatedModal(productTitle, wasPublished) {
  document.getElementById('adminSuccessModal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'adminSuccessModal';
  modal.className = 'admin-success-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'adminSuccessTitle');
  modal.innerHTML = `
    <div class="admin-success-dialog">
      <button type="button" class="admin-success-close" aria-label="Cerrar confirmación">&times;</button>
      <div class="admin-success-icon" aria-hidden="true">✓</div>
      <span class="section-tag">Catálogo actualizado</span>
      <h2 id="adminSuccessTitle">¡Producto creado!</h2>
      <p><strong>${escapeHTML(productTitle)}</strong> se agregó correctamente al inventario.</p>
      <p class="admin-success-note">${wasPublished ? 'Ya está visible en el catálogo público.' : 'Quedó guardado como borrador.'}</p>
      <button type="button" class="btn btn-primary" data-admin-success-close>Continuar</button>
    </div>
  `;

  const close = () => {
    modal.classList.remove('is-visible');
    window.setTimeout(() => modal.remove(), 180);
  };
  const handleEscape = event => {
    if (event.key !== 'Escape' || !document.body.contains(modal)) return;
    close();
    document.removeEventListener('keydown', handleEscape);
  };
  modal.addEventListener('click', event => {
    if (event.target === modal || event.target.closest('[data-admin-success-close], .admin-success-close')) {
      close();
      document.removeEventListener('keydown', handleEscape);
    }
  });
  document.addEventListener('keydown', handleEscape);
  document.body.append(modal);
  requestAnimationFrame(() => modal.classList.add('is-visible'));
  modal.querySelector('[data-admin-success-close]')?.focus();
}

export async function renderAdminPage() {
  if (!isSupabaseConfigured) return renderConfigurationRequired();
  const editMatch = window.location.hash.match(/^#\/admin\/edit\/([^/?#]+)/);
  editingProductId = editMatch ? decodeURIComponent(editMatch[1]) : null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return renderLogin();
  try {
    const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin');
    if (roleError) throw roleError;
    if (!isAdmin) {
      return `<div class="admin-auth-page"><section class="admin-auth-panel"><span class="section-tag">Acceso denegado</span><h1>Sin permisos de administrador</h1><p>Esta cuenta inició sesión, pero todavía no está registrada como administradora.</p><button type="button" class="btn btn-secondary" id="adminLogoutBtn">Cerrar sesión</button></section></div>`;
    }
    adminProducts = await fetchAdminProducts();
    return renderPanel();
  } catch (error) {
    return `${renderLogin()}<p class="admin-route-error">${escapeHTML(error.message)}</p>`;
  }
}

export function setupAdminPageEvents() {
  const loginForm = document.getElementById('adminLoginForm');
  loginForm?.addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(loginForm);
    const { error } = await supabase.auth.signInWithPassword({ email: form.get('email'), password: form.get('password') });
    if (error) return showFeedback('No se pudo iniciar sesión. Verifica tus datos.');
    window.location.hash = '#/admin';
  });

  document.getElementById('adminLogoutBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.hash = '#/admin';
  });

  document.getElementById('adminNewProductBtn')?.addEventListener('click', () => {
    editingProductId = null;
    window.location.hash = '#/admin/new';
  });

  const productForm = document.getElementById('adminProductForm');
  const titleInput = productForm?.querySelector('[name="title"]');

  const productsList = document.getElementById('adminProductsList');
  productsList?.addEventListener('click', async event => {
    const editButton = event.target.closest('[data-admin-edit]');
    if (editButton) {
      editingProductId = editButton.dataset.adminEdit;
      window.location.hash = `#/admin/edit/${encodeURIComponent(editButton.dataset.adminEdit)}`;
      return;
    }

    const deleteButton = event.target.closest('[data-admin-delete]');
    if (!deleteButton) return;

    if (deleteButton.dataset.confirmed !== 'true') {
      deleteButton.dataset.confirmed = 'true';
      deleteButton.textContent = 'Confirmar eliminación';
      deleteButton.classList.add('confirm-delete');
      window.setTimeout(() => {
        if (deleteButton.isConnected) {
          deleteButton.dataset.confirmed = 'false';
          deleteButton.textContent = 'Eliminar';
          deleteButton.classList.remove('confirm-delete');
        }
      }, 4000);
      return;
    }

    deleteButton.disabled = true;
    showFeedback('Eliminando producto...', 'success');
    try {
      await deleteProduct(deleteButton.dataset.adminDelete);
      adminProducts = await fetchAdminProducts();
      productsList.innerHTML = productRows();
      const productsCount = document.getElementById('adminProductsCount');
      if (productsCount) productsCount.textContent = String(adminProducts.length);
      showFeedback('Producto eliminado correctamente.', 'success');
    } catch (error) {
      deleteButton.disabled = false;
      showFeedback(`No se pudo eliminar: ${error.message}`);
    }
  });

  productForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if (isSavingProduct) return;
    isSavingProduct = true;
    const formElement = event.currentTarget;
    const submitButton = formElement.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add('is-loading');
      submitButton.textContent = 'Procesando producto...';
    }
    const form = new FormData(formElement);
    const current = editingProductId ? adminProducts.find(product => product.id === editingProductId) : null;
    try {
      const title = form.get('title').trim();
      const youtubeUrl = form.get('youtubeUrl').trim();
      if (youtubeUrl && !extractYouTubeId(youtubeUrl)) {
        throw new Error('El enlace no parece ser un video válido de YouTube.');
      }
      let image = current?.image || '';
      const imageFile = form.get('imageFile');
      if (imageFile?.size) {
        image = await uploadProductImage(imageFile, editingProductId || crypto.randomUUID(), message => {
          showFeedback(message, 'success');
          if (submitButton) submitButton.textContent = message;
        });
        showFeedback('Imagen optimizada. Guardando producto...', 'success');
        if (submitButton) submitButton.textContent = 'Guardando producto...';
      } else {
        showFeedback('Guardando producto...', 'success');
        if (submitButton) submitButton.textContent = 'Guardando producto...';
      }
      if (!image) throw new Error('Debes seleccionar una imagen principal.');
      const savedTitle = title;
      const wasPublished = form.get('published') === 'on';
      await saveProduct({
        title: savedTitle, slug: slugify(current?.slug || savedTitle), category: form.get('category'),
        description: form.get('description').trim(), youtubeUrl,
        materials: form.get('materials').trim(), dimensions: form.get('dimensions').trim(), image,
        availableColors: form.get('availableColors').split(',').map(value => value.trim()).filter(Boolean),
        published: wasPublished
      }, editingProductId);
      editingProductId = null;
      adminProducts = await fetchAdminProducts();
      isSavingProduct = false;
      const mainContent = document.getElementById('mainContent');
      if (mainContent) {
        mainContent.innerHTML = renderPanel();
        setupAdminPageEvents();
      }
      showProductCreatedModal(savedTitle, wasPublished);
    } catch (error) {
      showFeedback(`No se pudo guardar: ${error.message}`);
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove('is-loading');
        submitButton.textContent = editingProductId ? 'Guardar cambios' : 'Crear producto';
      }
      isSavingProduct = false;
    }
  });
}
