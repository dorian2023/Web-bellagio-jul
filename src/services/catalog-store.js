import { CATEGORIES_DATA, CATALOGS_DATA } from '../data/catalogs.js';

let catalogProducts = CATALOGS_DATA;
let catalogCategories = CATEGORIES_DATA;

export function setCatalogData({ products, categories }) {
  catalogProducts = products?.length ? products : CATALOGS_DATA;
  catalogCategories = categories?.length ? categories : CATEGORIES_DATA;
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
