import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Fix: add twitter image back + favicon + theme-color before Google Fonts preconnect
const target = '<link rel="preconnect" href="https://fonts.googleapis.com"';
const replacement = `<meta name="twitter:image" content="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&amp;fit=crop&amp;w=1200&amp;q=80" />

    <!-- Favicon & Icons -->
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/logo.jpg" />
    <meta name="theme-color" content="#0B0B0C" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com"`;

html = html.replace(target, replacement);
fs.writeFileSync('index.html', html);
console.log('index.html fixed!');
