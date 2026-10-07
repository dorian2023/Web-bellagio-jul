# 🏛️ Muebles Bellagio — Plataforma Web & Catálogo Digital Oficial

> Aplicación web oficial, catálogo interactivo con asesor de diseño IA y panel administrativo para **Muebles Bellagio** en Caracas, Venezuela.

---

## 📌 Tabla de Contenidos
1. [Visión General & Propósito](#-visión-general--propósito)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura del Proyecto](#-estructura-del-proyecto)
4. [Instalación & Configuración Local](#-instalación--configuración-local)
5. [Variables de Entorno](#-variables-de-entorno)
6. [Arquitectura & Módulos Clave](#-arquitectura--módulos-clave)
7. [Seguridad & Políticas de Acceso (RLS)](#-seguridad--políticas-de-acceso-rls)
8. [Despliegue en Producción (Vercel)](#-despliegue-en-producción-vercel)
9. [Guía de Traspaso y Continuidad](#-guía-de-traspaso-y-continuidad)

---

## 🛋️ Visión General & Propósito

Esta plataforma fue desarrollada para modernizar la presencia digital y la experiencia de compra de **Muebles Bellagio**, integrando:

- **Catálogo Digital Vivo (17 Categorías A-Z):** Exploración por ambientes, buscador instantáneo y fichas detalladas con dimensiones, materiales y origen (Nacional o Importado).
- **Asistente Bellagio (IA en Vivo):** Asesor inteligente conectado al catálogo real mediante Google Gemini AI (`gemini-3.8-flash`) para responder consultas sobre medidas, maderas, estilos y guiar a WhatsApp.
- **Canal de Conversión WhatsApp Directo:** Cotizaciones pre-llenadas automáticas con las piezas seleccionadas enviadas al WhatsApp de ventas (`+58 414-1536516`).
- **Panel de Administración (`/admin`):** Gestión en tiempo real de productos, inventario, categorías y subida optimizada de imágenes a Supabase Storage sin tocar código.
- **Showrooms Oficiales:** Directorio de las 3 sedes en Caracas (Av. Comercio, C.C. Davinci en La Yaguara y C.C. Casa Mall en El Cafetal) con microdatos `Schema.org`.

---

## ⚡ Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Framework** | **Next.js 14 (App Router)** | Renderizado híbrido SSG/SSR, rendimiento óptimo y SEO canónico indexable. |
| **Lenguaje** | **TypeScript 5** | Tipado estricto al 100%, interfaces de catálogo y validaciones seguras. |
| **Estilos** | **CSS Modular con Design Tokens** | Sistema de diseño "Quiet Luxury" con soporte completo para **Modo Claro (Ivory Luxury)** y **Modo Oscuro (Obsidian Glassmorphism)**. |
| **Base de Datos & Auth** | **Supabase (PostgreSQL 15)** | Persistencia de productos, perfiles de administrador y autenticación segura. |
| **Almacenamiento** | **Supabase Storage** | Bucket `product-images` con optimización automática de imágenes en el cliente (WebP). |
| **Inteligencia Artificial** | **Google Gemini API** | Asistente conversacional con grounding en el inventario activo. |
| **Hosting & CDN** | **Vercel** | Infraestructura serverless global con despliegue continuo (CI/CD) desde GitHub. |

---

## 📂 Estructura del Proyecto

```text
├── src/
│   ├── app/                         # App Router de Next.js
│   │   ├── admin/                   # Panel de administración de catálogo y fotos
│   │   ├── api/concierge/           # Endpoint Serverless para el Asistente Bellagio (Gemini)
│   │   ├── catalogo/                # Directorio general y rutas dinámicas [categoria]
│   │   ├── tiendas/                 # Showrooms y sedes de Caracas
│   │   ├── layout.tsx               # Layout raíz, Navbar, Footer, Widgets y Schema.org
│   │   ├── page.tsx                 # Landing page principal
│   │   ├── robots.ts                # Configuración de rastreo SEO
│   │   └── sitemap.ts               # Generación dinámica del mapa del sitio
│   ├── components/
│   │   ├── catalog/                 # CatalogBrowser, ProductModal, InquiryFloatingCart
│   │   ├── concierge/               # Asistente Bellagio (Chat interactivo)
│   │   ├── hero/                    # Hero cinematográfico con video de fondo
│   │   ├── home/                    # About, FeaturedCatalogs (3D Orbit), Contact
│   │   └── shared/                  # Navbar, Footer, WhatsAppWidget, FlagIcons
│   ├── data/                        # Datos estáticos de respaldo (catalogs, stores, stats)
│   ├── lib/                         # Cliente de Supabase y normalizador de productos
│   ├── styles/                      # tokens.css, components.css, sections.css
│   ├── types/                       # Interfaces TypeScript (Product, Category, etc.)
│   └── utils/                       # inquiry-cart, media, security, image-optimization
├── supabase/
│   ├── schema.sql                   # Esquema SQL, tablas y políticas RLS
│   └── migration_complete_bellagio.sql # Migración consolidada de base de datos
├── public/                          # Activos estáticos, logos, videos e íconos
├── next.config.mjs                  # Configuración de cabeceras de seguridad y optimización de imágenes
├── tsconfig.json                    # Configuración de TypeScript
└── package.json                     # Scripts y dependencias del proyecto
```

---

## 🛠️ Instalación & Configuración Local

### Requisitos Previos
- **Node.js:** Versión 18.18 o superior (recomendado Node 20 LTS).
- **NPM** o **PNPM**.

### Pasos
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/dorian2023/Web-bellagio-jul.git
   cd Web-bellagio-jul
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Duplicar el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```
   Completar las credenciales en `.env.local` (ver sección siguiente).

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abrir en el navegador: `http://localhost:3000`

5. **Compilar para producción local:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🔐 Variables de Entorno

Configurar las siguientes claves en `.env.local` (desarrollo) y en **Vercel Project Settings > Environment Variables** (producción):

```ini
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima_o_publishable

# Google Gemini AI (Asistente Bellagio)
GEMINI_API_KEY=tu_clave_api_de_google_ai_studio

# Upstash Redis (Opcional - Rate limiting distribuido)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## 🛡️ Seguridad & Políticas de Acceso (RLS)

La base de datos en Supabase opera bajo el principio de menor privilegio con **Row Level Security (RLS)** estricto:

1. **Catálogo Público (`products` / `categories`):**
   - Lectura anónima permitida únicamente para registros marcados como `published = true`.
   - Modificación, inserción y eliminación restringida exclusivamente a usuarios con rol `admin` verificado en la tabla `profiles`.
2. **Storage (`product-images`):**
   - Lectura pública para visualización en alta velocidad en la web.
   - Carga y borrado de archivos restringido a administradores autenticados.
3. **API Asistente Bellagio (`/api/concierge`):**
   - Sanitización de entradas (máximo 1000 caracteres por mensaje).
   - Rate limiting por IP (máximo 15 peticiones por minuto) para prevenir abusos.
   - Clave `GEMINI_API_KEY` encapsulada en el backend serverless, nunca expuesta al cliente.
4. **Cabeceras HTTP de Seguridad:**
   - HSTS (`Strict-Transport-Security`), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, y `Content-Security-Policy-Report-Only`.

---

## 🚀 Despliegue en Producción (Vercel)

El proyecto está vinculado al repositorio de GitHub con **CI/CD automatizado**. Cada commit o pull request en la rama `main` dispara una compilación y despliegue instantáneo en Vercel.

- **URL de Producción Vercel:** `https://web-bellagio-agosto-2026.vercel.app`
- **Dominio Canónico Oficial:** `https://www.mueblesbellagio.com`

---

## 📋 Guía de Traspaso y Continuidad

Para garantizar la autonomía y continuidad de la empresa:
1. **GitHub:** Transferir la propiedad del repositorio a una Organización oficial de Muebles Bellagio (*Settings > Danger Zone > Transfer ownership*).
2. **Vercel:** Transferir el proyecto al equipo de Vercel de la empresa.
3. **Supabase:** Transferir el proyecto de base de datos a la organización corporativa de Supabase.
4. **Google AI Studio:** Generar una `GEMINI_API_KEY` dedicada bajo la cuenta corporativa de la empresa y configurarla en Vercel.

---

**© 2026 Muebles Bellagio C.A. — Todos los derechos reservados.**
