/**
 * @file catalog-store.ts
 * @description In-memory store and subscription hub for product catalog data.
 */

import { Product, Category } from '@/src/types/catalog';
import { CATEGORIES_DATA, CATALOGS_DATA } from '@/src/data/catalogs';

let catalogProducts: Product[] = CATALOGS_DATA;
let catalogCategories: Category[] = CATEGORIES_DATA;
const listeners = new Set<() => void>();

export function subscribeCatalog(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setCatalogData({ products, categories }: { products?: Product[]; categories?: Category[] }) {
  catalogProducts = products?.length ? products : CATALOGS_DATA;
  catalogCategories = categories?.length ? categories : CATEGORIES_DATA;
  listeners.forEach(listener => listener());
}

export function getCatalogProducts(): Product[] {
  return catalogProducts;
}

export function getCatalogCategories(): Category[] {
  return catalogCategories;
}

export function getCatalogProduct(productId: string): Product | undefined {
  return catalogProducts.find(product => product.id === productId);
}
