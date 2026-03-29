const https = require('https');
https.get('https://www.sirnik.co/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Extract CSS links
    const cssLinks = [...data.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g)].map(m => m[1]);
    console.log('--- CSS Links ---');
    console.log(cssLinks);
    
    // Extract font-face src URLs
    const fonts = [...data.matchAll(/href="([^"]+\.woff2?)"/g)].map(m => m[1]);
    console.log('--- Font Files ---');
    console.log(fonts);
    
    // Inline fonts
    const fontFamilies = [...data.matchAll(/font-family:([^;\"}]+)/g)].map(m => m[1]);
    console.log('--- Inline Font Families ---');
    console.log([...new Set(fontFamilies)]);
  });
}).on('error', err => {
  console.log('Error:', err.message);
});
