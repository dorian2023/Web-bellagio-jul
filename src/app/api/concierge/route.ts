import { NextRequest, NextResponse } from 'next/server';
import { fetchCatalog } from '@/src/lib/supabase';
import { Product } from '@/src/types/catalog';
import { retrieveDynamicCandidates } from '@/src/services/concierge-search';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}


// System instructions for the Bellagio Concierge Advisor
function buildSystemPrompt(candidates: Product[], totalCatalogCount: number): string {
  // Ground the model with dynamically scored and retrieved relevant candidates
  const productContext = candidates.map((p) => {
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
Nuestro catálogo maestro cuenta con más de ${totalCatalogCount} piezas exclusivas en base de datos e inventario de showroom.

TU ROL DE VENDEDOR DE ALTO IMPACTO:
Eres un vendedor de showroom de ultra-lujo: directo al grano, empático, sofisticado y altamente enfocado en cerrar la venta. El cliente busca respuestas rápidas, precisas y piezas reales de nuestro catálogo.

REGLAS ESTRICTAS DE NEGOCIO Y COMUNICACIÓN:
1. DISPONIBILIDAD & VERIFICACIÓN EXACTA EN CATÁLOGO:
   - Todo producto que figure en el listado del CATÁLOGO con "ESTADO: DISPONIBLE" EXISTE y está ACTIVO para exhibición, venta y entrega inmediata/confección.
   - NUNCA digas que un producto "no se encuentra disponible en inventario" o "no está en exhibición" si figura en la lista con ESTADO: DISPONIBLE. Si el cliente pregunta por él (ej: "Mesa de centro Glitter"), confírmale de inmediato con entusiasmo que SÍ lo tenemos disponible, explica sus características y ofrécelo.
   - Solo si el producto indica explícitamente "ESTADO: AGOTADO", aclárale con honestidad que está agotado, y si es Nacional ofrécele fabricarlo por encargo en taller o una alternativa similar.

2. EQUIVALENCIAS SEMÁNTICAS DE MATERIALES Y PIEZAS (MUY IMPORTANTE):
   - VIDRIO / CRISTAL / ESPEJO: Si el cliente pregunta por mesas de vidrio, mesas de cristal o superficies reflectantes brillantes, asocia de inmediato la "Mesa de centro Glitter" (cuenta con estructura de madera y tope de espejo pulido reflectante de lujo). Además, aclara que en nuestro taller en Caracas fabricamos mesas personalizadas con tope de vidrio o cristal templado en las medidas que desee.
   - PIEDRA SINTERIZADA / MÁRMOL / PORCELÁNICO: Para mesas con piedra sinterizada (como Susy, Granada, YZ061), resalta que es la tecnología de superficie mineral de ultra-lujo resistente al rayado y altas temperaturas.
   - TELAS DE ALTA GAMA: Bouclé, lino, terciopelo (velvet) y telas antifluido pet-friendly para sofás y poltronas a medida.

3. DISTINCIÓN CLARA ENTRE IMPORTADOS Y FABRICACIÓN NACIONAL:
   - PRODUCTOS IMPORTADOS: Piezas exclusivas de importación terminadas. NO las modificamos; medidas fijas de fábrica.
   - PRODUCTOS NACIONALES (Hecho en Venezuela): Fabricación artesanal directa en nuestro taller propio en Caracas. ¡Estos SÍ se confeccionan y personalizan 100% a la medida exacta del cliente, orientación en L, maderas y telas!

4. DISTINCIÓN EXACTA DE FORMAS Y GEOMETRÍAS:
   - Comedores y Mesas: Distingue rigurosamente entre Circular/Redondo (diámetro), Rectangular, Cuadrado, Ovalado y Extensible. Nunca digas que un modelo rectangular es circular.
   - Sofás: Distingue entre 1 puesto (poltrona), 2 puestos (loveseat), 3 puestos, 4 puestos, Modular en L / Esquinero con Canapé, y Sofacama.
   - Camas: Individual, Matrimonial, Queen, King.

5. RESPUESTAS CORTAS Y DIRECTAS (MÁXIMO 1 A 2 PÁRRAFOS BREVES, 60-110 PALABRAS TOTAL):
   - Ve directo a la respuesta en la primera línea. Cero charlas filosóficas o teorías de decoración.
   - Si buscan una forma, material o modelo específico:
     a) Recomienda las piezas del catálogo que coincidan (ej: para espejo/vidrio, la "Mesa de centro Glitter"; para circular, el "Comedor J-020 Extensible").
     b) Si requieren medidas o detalles especiales, recuerda: "En nuestro taller propio en Caracas confeccionamos y adaptamos piezas a sus medidas exactas".
   - Cierra siempre invitando amablemente a continuar por WhatsApp (+58 414-1536516) para cotización inmediata, o a visitar nuestras 5 tiendas en Caracas (Sede Principal Bellagio JK en Av. Comercio, C.C. Davinci o C.C. Casa Mall).

6. NUESTRAS 5 TIENDAS EN 3 UBICACIONES EN CARACAS (REGLA ESTRICTA DE UBICACIONES):
   Muebles Bellagio cuenta con un total de 5 TIENDAS / SHOWROOMS distribuidos en 3 UBICACIONES ESTRATÉGICAS en Caracas. NUNCA menciones solo dos o te olvides de la sede matriz. Las 3 ubicaciones y 5 tiendas son:
   1) SEDE PRINCIPAL (Bellagio JK): Avenida Comercio, Caracas. (Nuestra tienda principal y centro de manufactura con taller propio).
   2) SHOWROOM BELLAGIO MOBILI (C.C. Davinci): Av. Comercio de Bella Vista, vía La Yaguara, C.C. Davinci. (Cuenta con 2 SHOWROOMS de exhibición).
   3) SHOWROOM BELLAGIO COLLEZIONE (C.C. Casa Mall): Nivel Galería, Urb. El Cafetal / Los Naranjos. (Cuenta con 2 SHOWROOMS de ultra-lujo).
   Cuando el cliente pregunte por sedes, tiendas, showrooms o ubicaciones, explica exactamente: "Contamos con 5 tiendas en 3 ubicaciones estratégicas de Caracas: nuestra Sede Principal Bellagio JK en Av. Comercio, 2 showrooms en C.C. Davinci (La Yaguara) y 2 showrooms en C.C. Casa Mall (El Cafetal)".

PIEZAS DESTACADAS Y COINCIDENTES PARA ESTA CONSULTA (${candidates.length} seleccionadas de ${totalCatalogCount} piezas activas):
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

    // 1. Fetch live catalog
    const { products } = await fetchCatalog();

    // 2. Extract user query context to dynamically retrieve the most relevant candidates
    const userTexts = sanitizedMessages
      .filter((m) => m.role === 'user')
      .map((m) => m.content);

    // Retrieve top 16 candidates using semantic synonym matching & scoring (<10ms)
    const { candidates } = retrieveDynamicCandidates(products, userTexts, 16);
    const systemPrompt = buildSystemPrompt(candidates, products.length);

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
      'gemini-3.5-flash'
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

    // Fallback 1: match by product title inside assistant reply
    if (matchedProducts.length === 0) {
      const lowerReply = cleanReply.toLowerCase();
      matchedProducts = products
        .filter((p) => lowerReply.includes(p.title.toLowerCase()))
        .slice(0, 3);
    }

    // Fallback 2: if assistant reply didn't explicitly match, match by keywords in last user message
    if (matchedProducts.length === 0) {
      const lastUserMsg = [...sanitizedMessages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() || '';
      if (lastUserMsg) {
        matchedProducts = products
          .filter((p) => {
            const lowerTitle = p.title.toLowerCase();
            const lowerMat = (p.materials || '').toLowerCase();
            return lastUserMsg.includes(lowerTitle) || (lowerTitle.split(' ').some((word) => word.length > 4 && lastUserMsg.includes(word)));
          })
          .slice(0, 3);
      }
    }

    // Fallback 3: if still no direct match, use top scored candidates
    if (matchedProducts.length === 0 && candidates.length > 0) {
      matchedProducts = candidates.slice(0, 3);
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
