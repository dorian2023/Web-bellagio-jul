import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      color: '#fff'
    }}>
      <h1 style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '4rem',
        marginBottom: '1rem',
        background: 'linear-gradient(135deg, #FFE8B0 0%, #E6C875 50%, #C99700 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        404
      </h1>
      <p style={{
        fontSize: '1.25rem',
        color: '#A3A3A3',
        marginBottom: '2rem',
        maxWidth: '500px'
      }}>
        La pieza exclusiva o página que buscas no se encuentra disponible en nuestro catálogo actual.
      </p>
      <Link
        href="/catalogo"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.85rem 1.75rem',
          background: 'linear-gradient(135deg, #d4af37 0%, #aa8010 100%)',
          color: '#000',
          fontWeight: 600,
          borderRadius: '50px',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '0.85rem',
          boxShadow: '0 4px 20px rgba(212, 175, 55, 0.3)'
        }}
      >
        Explorar Catálogo Bellagio
      </Link>
    </div>
  );
}
