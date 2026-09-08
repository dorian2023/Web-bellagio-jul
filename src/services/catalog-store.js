import { CATEGORIES_DATA, CATALOGS_DATA } from '../data/catalogs.js';

let catalogProducts = CATALOGS_DATA;
let catalogCategories = CATEGORIES_DATA;
const listeners = new Set();

export function subscribeCatalog(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setCatalogData({ products, categories }) {
  catalogProducts = products?.length ? products : CATALOGS_DATA;
  catalogCategories = categories?.length ? categories : CATEGORIES_DATA;
  listeners.forEach(listener => listener());
}

export function getCatalogProducts() {
  return catalogProducts;
}

export function getCatalogCategories() {
  return catalogCategories;
}

export function getCatalogProduct(productId) {
  return catalogProducts.find(product => product.id === productId);
}
