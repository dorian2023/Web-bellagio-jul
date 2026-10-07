/**
 * @file inquiry-cart.ts
 * @description State manager and utilities for the WhatsApp Inquiry Cart.
 * Allows customers to select products of interest and send a consolidated inquiry via WhatsApp.
 */

import { Product } from '@/src/types/catalog';
import { getCatalogProducts } from '@/src/services/catalog-store';
import { escapeHTML } from '@/src/utils/security';
import { getOptimizedImageUrl } from '@/src/utils/image-optimization';

/** Selected product IDs */
const selectedProducts = new Set<string>();

// Safely initialize from localStorage in client environment
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('bellagio_selected_products');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => selectedProducts.add(String(id)));
      }
    }
  } catch {
    // Ignore storage parse errors
  }
}

/** WhatsApp number for Bellagio */
const WHATSAPP_NUMBER = '584141536516';

/**
 * Persists current selections and optional cached product details to localStorage and notifies listeners.
 */
function persistSelections(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bellagio_selected_products', JSON.stringify(Array.from(selectedProducts)));
      window.dispatchEvent(new CustomEvent('bellagio:cart-updated', {
        detail: {
          count: selectedProducts.size,
          selectedIds: Array.from(selectedProducts)
        }
      }));
    } catch {
      // Ignore quota/access errors
    }
  }
}

/**
 * Toggles a product's selection state and caches product details if provided.
 */
export function toggleProductSelection(productId: string | number, productDetails: Partial<Product> | null = null): boolean {
  if (!productId) return false;
  const idStr = String(productId);
  if (selectedProducts.has(idStr)) {
    selectedProducts.delete(idStr);
    if (typeof window !== 'undefined') {
      try {
        const detailsRaw = localStorage.getItem('bellagio_selected_products_details');
        if (detailsRaw) {
          const detailsMap = JSON.parse(detailsRaw);
          delete detailsMap[idStr];
          localStorage.setItem('bellagio_selected_products_details', JSON.stringify(detailsMap));
        }
      } catch {}
    }
  } else {
    selectedProducts.add(idStr);
    if (typeof window !== 'undefined' && productDetails) {
      try {
        const detailsRaw = localStorage.getItem('bellagio_selected_products_details');
        const detailsMap = detailsRaw ? JSON.parse(detailsRaw) : {};
        detailsMap[idStr] = {
          id: productDetails.id,
          title: productDetails.title,
          category: productDetails.category,
          categoryName: productDetails.categoryName,
          materials: productDetails.materials,
          dimensions: productDetails.dimensions,
          image: productDetails.image
        };
        localStorage.setItem('bellagio_selected_products_details', JSON.stringify(detailsMap));
      } catch {}
    }
  }

  persistSelections();
  if (typeof document !== 'undefined') {
    updateProductCardStates();
    updateFAB();
  }
  return selectedProducts.has(idStr);
}

/**
 * Returns the current count of selected products.
 */
export function getSelectionCount(): number {
  return selectedProducts.size;
}

/**
 * Checks if a product is selected.
 */
export function isProductSelected(productId: string | number): boolean {
  if (!productId) return false;
  return selectedProducts.has(String(productId));
}

/**
 * Clears all selections and stored details.
 */
export function clearAllSelections(): void {
  selectedProducts.clear();
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem('bellagio_selected_products_details');
    } catch {}
  }
  persistSelections();
  if (typeof document !== 'undefined') {
    updateProductCardStates();
    updateFAB();
  }
}

/**
 * Updates the visual state of all product cards based on selection.
 */
function updateProductCardStates(): void {
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.getAttribute('data-product-id');
    if (!id) return;
    const isSelected = selectedProducts.has(id);
    card.classList.toggle('product-selected', isSelected);

    const checkbox = card.querySelector('.product-select-check');
    if (checkbox) {
      checkbox.classList.toggle('checked', isSelected);
      checkbox.setAttribute('aria-checked', String(isSelected));
    }
  });
}

/**
 * Updates the Floating Action Button visibility and count.
 */
function updateFAB(): void {
  const fab = document.getElementById('inquiryCartFAB');
  if (!fab) return;

  const count = selectedProducts.size;
  const badge = fab.querySelector('.fab-count-badge');

  if (count > 0) {
    fab.classList.add('visible');
    if (badge) badge.textContent = String(count);
    fab.classList.remove('fab-bounce');
    void fab.offsetWidth; // Force reflow
    fab.classList.add('fab-bounce');
  } else {
    fab.classList.remove('visible');
  }
}

/**
 * Builds a formatted WhatsApp quotation link from an array of products.
 */
export function buildWhatsAppInquiryUrl(products: Product[], customNote?: string): string {
  let message = `✨ *Consulta de Productos - Muebles Bellagio*\n\n`;
  message += `Hola, estoy interesado/a en las siguientes piezas:\n\n`;

  products.forEach((item, i) => {
    message += `${i + 1}. *${item.title}*\n`;
    message += `   📂 ${item.categoryName || 'Catálogo Bellagio'} | 📐 ${item.dimensions || 'A medida'}\n\n`;
  });

  message += `Total: ${products.length} ${products.length === 1 ? 'pieza' : 'piezas'}\n`;

  if (customNote && customNote.trim()) {
    message += `\n💬 Mensaje adicional: ${customNote.trim()}\n`;
  }

  message += `\nDeseo información de disponibilidad, acabados y presupuesto personalizado. ¡Gracias!`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
