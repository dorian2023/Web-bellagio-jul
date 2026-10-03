import { NextRequest, NextResponse } from 'next/server';
import { fetchCatalog } from '@/src/lib/supabase';
import { Product } from '@/src/types/catalog';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}


// System instructions for the Bellagio Concierge Advisor
function buildSystemPrompt(products: Product[]): string {
  // Ground the model with 100% of the live catalog in a token-efficient compact schema
  const productContext = products.map((p) => {
    const stock = p.stockStatus === 'agotado' ? 'ESTADO: AGOTADO' : 'ESTADO: DISPONIBLE';
    const orig = p.origin === 'importado'
      ? 'ORIGEN: IMPORTADO (Pieza importada terminada, medidas estándar fijas, NO se modifica en taller)'
      : 'ORIGEN: NACIONAL (Fabricación artesanal directa en taller Bellagio Caracas, 100% personalizable a medida exacta, telas y acabados)';
    const dims = p.dimensions ? `Medidas: "${p.dimensions}"` : 'Medidas: "A medida"';
    const mats = p.materials ? `Material: "${p.materials}"` : '';
    const desc = p.description ? `Desc: "${p.description}"` : '';
    const colors = (p.availableColors || []).length > 0 ? `Colores: ${p.availableColors.join(', ')}` : '';
    const details = [stock, orig, dims, mats, desc, colors].filter(Boolean).join(' | ');
    return `[ID: ${p.id}] "${p.title}" | Cat: ${p.categoryName} (${p.category}) | ${details}`;
  }).join('\n');

  return `Eres "Asistente Bellagio", el Asesor Senior de Ventas y Mobiliario de Lujo de Muebles Bellagio en Caracas, Venezuela.

TU ROL DE VENDEDOR DE ALTO IMPACTO:
Eres un vendedor de showroom de ultra-lujo: directo al grano, empático, sofisticado y altamente enfocado en cerrar la venta. El cliente busca respuestas rápidas, precisas y piezas reales de nuestro catálogo.

REGLAS ESTRICTAS DE NEGOCIO Y COMUNICACIÓN:
1. DISPONIBILIDAD & STOCK:
   - Prioriza siempre piezas con "ESTADO: DISPONIBLE".
   - Si un producto dice "ESTADO: AGOTADO", no lo ofrezcas como entrega inmediata. Si el cliente pregunta específicamente por un modelo agotado, aclárale con honestidad que está agotado, y si es Nacional ofrécele confeccionarlo por encargo en taller, o recomiéndale una alternativa similar disponible.

2. DISTINCIÓN CLARA ENTRE IMPORTADOS Y FABRICACIÓN NACIONAL:
   - PRODUCTOS IMPORTADOS: Son piezas exclusivas de importación ya terminadas. NO las fabricamos nosotros y tienen medidas estándar fijas de fábrica (NO se alteran dimensiones).
   - PRODUCTOS NACIONALES (Hecho en Venezuela): Fabricación artesanal directa en nuestro taller propio en Caracas. ¡Estos SÍ se confeccionan y personalizan 100% a la medida exacta del cliente, orientación en L, maderas y telas (lino, bouclé, terciopelo, antifluido pet-friendly)!

3. DISTINCIÓN EXACTA DE FORMAS Y GEOMETRÍAS:
   - Comedores y Mesas: Distingue rigurosamente entre Circular/Redondo (diámetro), Rectangular, Cuadrado, Ovalado y Extensible. Nunca digas que un modelo rectangular es circular.
   - Sofás: Distingue entre 1 puesto (poltrona), 2 puestos (loveseat), 3 puestos, 4 puestos, Modular en L / Esquinero con Canapé, y Sofacama.
   - Camas: Individual, Matrimonial, Queen, King.

4. RESPUESTAS CORTAS Y DIRECTAS (MÁXIMO 1 A 2 PÁRRAFOS BREVES, 60-110 PALABRAS TOTAL):
   - Ve directo a la respuesta en la primera línea. Cero charlas filosóficas o teorías de decoración.
   - Si buscan una forma o medida específica (ej: "comedor circular", "sofá 2.20m"):
     a) Recomienda las piezas del catálogo que coincidan exactamente (ej: para circular, el "Comedor J-020 Extensible").
     b) Si no hay más modelos con esa forma prefabricada, explica brevemente: "En nuestro taller en Caracas confeccionamos a medida comedores con tope circular en el diámetro exacto que requieras (1.20m, 1.40m, etc.)".
     c) Puedes sugerir 1 o 2 modelos más del catálogo como alternativas o bases adaptables, aclarando su formato real.
   - Cierra siempre invitando amablemente a continuar por WhatsApp (+58 414-1536516) para cotización y muestras, o visitar nuestros showrooms en Caracas (Casa Mall en El Cafetal, C.C. Davinci en La Yaguara o Av. Comercio).

CATÁLOGO REAL EN VIVO (${products.length} PIEZAS DISPONIBLES):
${productContext}

FORMATO OBLIGATORIO DE RESPUESTA:
[Párrafo 1 y 2 concisos con la recomendación directa, opciones a medida y llamada a cotizar por WhatsApp (+58 414-1536516)]
<<<IDS: id_1, id_2>>>`;
}

// Rate limiting storage: map IP -> timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 15; // Máximo 15 peticiones por minuto por IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];

  // Limpiar timestamps fuera de la ventana
  const recentTimestamps = timestamps.filter(time => now - time < RATE_LIMIT_WINDOW_MS);

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, recentTimestamps);
    return true;
  }

  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return false;
}

// Limpieza periódica de memoria cada 5 minutos
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((timestamps, ip) => {
      const active = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (active.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, active);
      }
    });
  }, 5 * 60 * 1000);
}

export async function POST(req: NextRequest) {
  try {
    // 0. Rate limiting por IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous';

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: 'Ha alcanzado el límite de consultas por minuto. Por favor, espere un momento antes de continuar.' },
        { status: 429 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('❌ [Concierge API] GEMINI_API_KEY no está configurada en las variables de entorno de Vercel/Servidor.');
      return NextResponse.json(
        { error: 'Clave de Gemini API no configurada en las variables de entorno de Vercel.' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Payload de solicitud inválido.' }, { status: 400 });
    }

    const rawMessages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];

    if (rawMessages.length === 0) {
      return NextResponse.json({ error: 'No se enviaron mensajes.' }, { status: 400 });
    }

    // Validación y sanitización estricta de mensajes
    const sanitizedMessages = rawMessages
      .slice(-10) // Conservar los últimos 10 mensajes de contexto
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: typeof msg.content === 'string' ? msg.content.trim().slice(0, 1000) : ''
      }))
      .filter((msg) => msg.content.length > 0);

    if (sanitizedMessages.length === 0) {
      return NextResponse.json({ error: 'El mensaje no contiene texto válido.' }, { status: 400 });
    }

    // 1. Fetch live catalog to ground the LLM with 100% of data
    const { products } = await fetchCatalog();
    const systemPrompt = buildSystemPrompt(products);

    // 2. Format history for Gemini API
    const contents: any[] = [];

    // Append sanitized conversation messages
    sanitizedMessages.forEach((msg) => {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    });

    // 3. Call Google Gemini API with current active models
    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-3.0-flash',
      'gemini-2.5-flash',
      'gemini-2.5-pro'
    ];
    let rawReply = '';
    let apiSuccess = false;

    for (const modelName of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048, // Generous limit to guarantee complete answers without truncation
              topP: 0.95
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (rawReply) {
            apiSuccess = true;
            break;
          }
        } else {
          const errText = await response.text();
          console.warn(`Gemini API con modelo ${modelName} devolvió:`, errText);
        }
      } catch (callErr) {
        console.warn(`Fallo al conectar con modelo ${modelName}:`, callErr);
      }
    }

    if (!apiSuccess || !rawReply) {
      return NextResponse.json(
        { error: 'No pudimos contactar al Asesor de Bellagio en este momento.' },
        { status: 502 }
      );
    }

    // 4. Extract structured <<<IDS: id1, id2, ...>>> tags or fallback [RECOMENDADOS: ...]
    const recommendedIds: string[] = [];
    const delimiterMatch = rawReply.match(/<<<IDS:\s*([^>]+)>>>/i) || rawReply.match(/\[(?:RECOMENDADOS|IDS_RECOMENDADOS):\s*([^\]]+)\]/i);

    if (delimiterMatch && delimiterMatch[1]) {
      const ids = delimiterMatch[1].split(',').map((id) => id.trim().replace(/['"]/g, ''));
      ids.forEach((id) => {
        if (id && !recommendedIds.includes(id)) {
          recommendedIds.push(id);
        }
      });
    }

    // Clean any delimiter tags from user-facing text cleanly
    let cleanReply = rawReply
      .replace(/<<<IDS:\s*[^>]+>>>/gi, '')
      .replace(/\[(?:RECOMENDADOS|IDS_RECOMENDADOS):\s*[^\]]+\]/gi, '')
      .trim();

    // 5. Match actual Product objects by ID
    let matchedProducts = products.filter((p) => recommendedIds.includes(String(p.id)));

    // Fallback if no IDs matched: search by exact/fuzzy title in the text
    if (matchedProducts.length === 0) {
      matchedProducts = products
        .filter((p) => cleanReply.toLowerCase().includes(p.title.toLowerCase()))
        .slice(0, 3);
    }

    return NextResponse.json({
      reply: cleanReply,
      products: matchedProducts.slice(0, 3)
    });
  } catch (error: any) {
    console.error('Error en Concierge API route:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al procesar su solicitud.' },
      { status: 500 }
    );
  }
}
