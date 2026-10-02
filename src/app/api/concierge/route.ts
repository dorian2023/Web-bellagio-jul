import { NextRequest, NextResponse } from 'next/server';
import { fetchCatalog } from '@/src/lib/supabase';
import { Product } from '@/src/types/catalog';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}


// System instructions for the Bellagio Concierge Advisor
function buildSystemPrompt(products: Product[]): string {
  const productContext = products.slice(0, 120).map((p) => {
    return `- ID: ${p.id} | Nombre: "${p.title}" | Categoría: ${p.categoryName} (${p.category}) | Origen: ${p.origin || 'nacional'} | Estado: ${p.stockStatus || 'disponible'} | Materiales: ${p.materials || 'Maderas nobles y acabados de lujo'} | Medidas: ${p.dimensions || 'A consultar'} | Colores: ${(p.availableColors || []).join(', ') || 'Variados'} | Imagen: ${p.image}`;
  }).join('\n');

  return `Eres "Asistente Bellagio", el Asesor Senior de Diseño de Interiores y Mobiliario de Alta Calidad de Muebles Bellagio en Caracas, Venezuela.

TU MISIÓN:
Asesorar con extrema elegancia, conocimiento y amabilidad a los clientes que visitan nuestra tienda web, responder sus dudas sobre muebles, estilos, materiales y sedes físicas, y guiarlos hacia productos de calidad hechos con los más altos estándares del mercado venezolano, así como piezas importadas de primer nivel, orientándolos a una cotización personalizada vía WhatsApp o visita a nuestros showrooms.

TONO Y PERSONALIDAD:
- Exclusivo, cortés, sobrio, respetuoso y altamente profesional ("Quiet Luxury").
- Habla en español elegante y acogedor. Trata al cliente con aprecio ("un placer saludarle", "con gusto le asesoro").
- NUNCA inventes precios numéricos directos (explica que cada pieza se personaliza en acabados y telas, por lo que las cotizaciones formales se entregan con gusto por WhatsApp).
- NUNCA inventes productos que no estén en el catálogo de Bellagio.

INFORMACIÓN DE SHOWROOMS OFICIALES EN CARACAS:
1. Sede Principal (Bellagio JK): Avenida Comercio, Caracas.
2. Showroom Bellagio Mobili (2 Showrooms): Bella Vista, vía La Yaguara, C.C. Davinci.
3. Showroom Bellagio Collezione (Casa Mall - 2 Showrooms): C.C. Casa Mall, Nivel Galería, Urb. El Cafetal.
WhatsApp Oficial: +58 414-1536516

ESTADO DE DISPONIBILIDAD:
- Si un producto tiene Estado "agotado", infórmale al cliente que está temporalmente agotado y que con gusto se puede consultar la fecha del próximo lote o encargar bajo pedido con nuestros artesanos.

CATÁLOGO REAL EN VIVO (${products.length} PIEZAS):
${productContext}

FORMATO DE RESPUESTA:
- Responde de forma clara, concisa y atractiva (máximo 2 a 3 párrafos cortos).
- Si mencionas o recomiendas productos específicos del catálogo, usa su nombre exacto.
- Al final de tu recomendación, invita cordialmente a cotizar o agendar una cita en showroom mediante WhatsApp.`;
}

// Rate limiting storage: map IP -> timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 12; // Máximo 12 peticiones por minuto por IP

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

    // Validación y sanitización estricta de mensajes (previene Prompt Injection masivo y ataques de payload)
    const sanitizedMessages = rawMessages
      .slice(-8) // Conservar solo los últimos 8 mensajes de contexto
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: typeof msg.content === 'string' ? msg.content.trim().slice(0, 800) : ''
      }))
      .filter((msg) => msg.content.length > 0);

    if (sanitizedMessages.length === 0) {
      return NextResponse.json({ error: 'El mensaje no contiene texto válido.' }, { status: 400 });
    }

    // 1. Fetch live catalog to ground the LLM
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

    // 3. Call Google Gemini API with fallback models and systemInstruction
    const candidateModels = [
      'gemini-3.8-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash-latest'
    ];
    let reply = '';
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
              maxOutputTokens: 800,
              topP: 0.95
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (reply) {
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

    if (!apiSuccess || !reply) {
      return NextResponse.json(
        { error: 'No pudimos contactar al Asesor de Bellagio en este momento.' },
        { status: 502 }
      );
    }

    // 4. Identify if any products were mentioned to return quick recommendation cards
    const mentionedProducts = products
      .filter((p) => reply.toLowerCase().includes(p.title.toLowerCase()))
      .slice(0, 3);

    return NextResponse.json({
      reply,
      products: mentionedProducts
    });
  } catch (error: any) {
    console.error('Error en Concierge API route:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error inesperado al procesar su solicitud.' },
      { status: 500 }
    );
  }
}
