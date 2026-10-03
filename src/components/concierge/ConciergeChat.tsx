'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/src/types/catalog';
import ProductModal from '@/src/components/catalog/ProductModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  timestamp: string;
}

const QUICK_PROMPTS = [
  '🛋️ Sofás de 3 puestos con medidas',
  '📏 ¿Fabrican muebles a mi medida exacta?',
  '🍽️ Comedores para 6 y 8 personas',
  '📍 Sedes y Showrooms en Caracas'
];

export default function ConciergeChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Bienvenido a Muebles Bellagio. Soy su Asesor Senior de Diseño e Interiorismo. Indíqueme qué ambiente o medidas busca (ej: "sofá de 3 puestos de 2.20m", "comedor de 8 personas") y con gusto le orientaré con piezas exactas de nuestro catálogo o fabricación personalizada a medida.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/concierge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: historyPayload })
      });

      if (!res.ok) {
        throw new Error('Error en el servicio');
      }

      const data = await res.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Con gusto le asisto. ¿Desea que profundicemos en algún modelo en específico?',
        products: data.products || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error enviando mensaje al Concierge:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Disculpe, en este momento estoy atendiendo a varios clientes. Con gusto puede escribirnos directamente por WhatsApp (+58 414-1536516) para una atención inmediata.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppTransfer = (lastMessageContent?: string) => {
    const contextSnippet = lastMessageContent ? ` (Consulta web: "${lastMessageContent.slice(0, 60)}...")` : '';
    const text = encodeURIComponent(`Hola Muebles Bellagio, estuve conversando con su Asesor Concierge en la web${contextSnippet} y deseo atención personalizada para cotizar.`);
    window.open(`https://wa.me/584141536516?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Floating Concierge Trigger Button */}
      <div className="concierge-trigger-container">
        {!isOpen && (
          <button
            type="button"
            className="concierge-floating-btn"
            onClick={() => setIsOpen(true)}
            aria-label="Abrir Asistente Bellagio"
            title="Asistente de Diseño en Línea"
          >
            <div className="concierge-badge-avatar">
              <img src="/logo.png" alt="Sello Bellagio" width={28} height={28} />
              <span className="concierge-online-dot"></span>
            </div>
            <div className="concierge-btn-text">
              <span className="concierge-btn-title">Asistente Bellagio</span>
              <span className="concierge-btn-subtitle">Diseño & Alta Gama</span>
            </div>
          </button>
        )}
      </div>

      {/* Concierge Chat Window */}
      {isOpen && (
        <div className="concierge-chat-modal" role="dialog" aria-modal="true" aria-label="Asistente Bellagio">
          {/* Header */}
          <div className="concierge-chat-header">
            <div className="concierge-header-brand">
              <div className="concierge-header-avatar">
                <img src="/logo.png" alt="Sello Bellagio" width={32} height={32} />
              </div>
              <div className="concierge-header-info">
                <h4>Asistente Bellagio</h4>
                <p>
                  <span className="concierge-live-pulse"></span>
                  Asesor de Diseño en Vivo
                </p>
              </div>
            </div>

            <button
              type="button"
              className="concierge-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar asesor"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="concierge-chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`concierge-msg-row ${msg.role === 'user' ? 'is-user' : 'is-assistant'}`}>
                {msg.role === 'assistant' && (
                  <div className="concierge-msg-avatar">
                    <img src="/logo.png" alt="B" width={18} height={18} />
                  </div>
                )}

                <div className="concierge-msg-bubble">
                  <div className="concierge-msg-text">
                    {msg.content.split('\n').map((paragraph, pIdx) => {
                      if (!paragraph.trim()) return <div key={pIdx} className="concierge-msg-spacer" />;
                      
                      // Simple inline markdown bold parser (**text**)
                      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={pIdx} className="concierge-msg-paragraph">
                          {parts.map((part, partIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={partIdx} className="concierge-msg-bold">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {/* Recommended Products Mini Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="concierge-product-recommendations">
                      <span className="concierge-rec-tag">Piezas recomendadas de nuestro catálogo:</span>
                      <div className="concierge-rec-list">
                        {msg.products.map((p) => (
                          <div
                            key={p.id}
                            className="concierge-rec-card"
                            onClick={() => setSelectedProduct(p)}
                            role="button"
                            tabIndex={0}
                            title={`Ver ficha completa de ${p.title}`}
                          >
                            <img 
                              src={p.image || '/images/hero-poster.webp'} 
                              alt={p.title} 
                              className="concierge-rec-img"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/hero-poster.webp';
                              }}
                            />
                            <div className="concierge-rec-info">
                              <strong className="concierge-rec-title">{p.title}</strong>
                              <div className="concierge-rec-meta">
                                <span>{p.categoryName}</span>
                                {p.dimensions && (
                                  <span className="concierge-rec-dim-badge">📏 {p.dimensions}</span>
                                )}
                              </div>
                            </div>
                            <span className="concierge-rec-arrow" aria-hidden="true">→</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="concierge-msg-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="concierge-msg-row is-assistant">
                <div className="concierge-msg-avatar">
                  <img src="/logo.png" alt="B" width={18} height={18} />
                </div>
                <div className="concierge-msg-bubble is-typing">
                  <div className="concierge-typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="concierge-quick-prompts">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="concierge-chip-btn"
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* WhatsApp Direct Handoff Footer */}
          <div className="concierge-handoff-bar">
            <button
              type="button"
              className="concierge-whatsapp-handoff"
              onClick={() => handleWhatsAppTransfer(messages[messages.length - 1]?.content)}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span>Continuar con un Asesor Humano por WhatsApp</span>
            </button>
          </div>

          {/* Input Footer */}
          <form
            className="concierge-chat-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="concierge-input-field"
              placeholder="Escriba su consulta sobre nuestros muebles..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              className="concierge-send-btn"
              disabled={isLoading || !input.trim()}
              aria-label="Enviar mensaje"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Modal detail if clicked from recommendations */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
}
