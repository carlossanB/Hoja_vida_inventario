// Busca texto con color blanco, gris muy claro o invisible en el documento
const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('./templates/hoja_de_vida_template.docx', 'binary');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();

console.log('=== COLORES DE TEXTO ENCONTRADOS ===');

// Buscar todos los w:color dentro del body
const colorMatches = xml.match(/<w:color[^/]*(\/?>)/g) || [];
const colorCounts = {};
colorMatches.forEach(function(m) {
  const val = (m.match(/w:val="([^"]+)"/) || [])[1];
  if (val) colorCounts[val] = (colorCounts[val] || 0) + 1;
});
Object.entries(colorCounts).sort().forEach(function([color, count]) {
  const flag = (color === 'FFFFFF' || color === 'ffffff' || color === 'white') ? ' <-- BLANCO/INVISIBLE' :
               (color === 'auto') ? ' (auto)' : '';
  console.log('  #' + color + ' x' + count + flag);
});

// Buscar texto especificamente con color FFFFFF (blanco)
console.log('\n=== PARRAFOS CON TEXTO BLANCO (FFFFFF) ===');
const segments = xml.split('</w:p>');
let blancosCount = 0;
segments.forEach(function(seg, idx) {
  if (seg.includes('FFFFFF') || seg.includes('ffffff')) {
    const textos = seg.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
    const textContent = textos.map(function(t) { return t.replace(/<[^>]+>/g, ''); }).join('').trim();
    if (textContent) {
      console.log('  Parrafo #' + idx + ': "' + textContent.substring(0, 100) + '"');
      blancosCount++;
    }
  }
});
if (blancosCount === 0) console.log('  Ninguno encontrado con texto visible blanco');

// Buscar highlight blanco o shading blanco
console.log('\n=== SHADING / HIGHLIGHT BLANCO ===');
const shadings = xml.match(/<w:shd[^/]*\/>/g) || [];
const shadingCounts = {};
shadings.forEach(function(s) {
  const fill = (s.match(/w:fill="([^"]+)"/) || [])[1];
  if (fill && fill !== 'auto') shadingCounts[fill] = (shadingCounts[fill] || 0) + 1;
});
Object.entries(shadingCounts).sort().forEach(function([color, count]) {
  console.log('  fill:#' + color + ' x' + count);
});

// Verificar si hay algun estilo global que ponga color blanco
console.log('\n=== VERIFICACION RAPIDA ESTILOS (styles.xml) ===');
const stylesXml = zip.file('word/styles.xml') ? zip.file('word/styles.xml').asText() : '';
const whiteInStyles = (stylesXml.match(/FFFFFF/gi) || []).length;
console.log('  Ocurrencias de FFFFFF en styles.xml:', whiteInStyles);

// Verificar header3.xml (el mas grande, probablemente el que tiene el contenido visible)
console.log('\n=== COLORES EN header3.xml (header con logo) ===');
const h3xml = zip.file('word/header3.xml') ? zip.file('word/header3.xml').asText() : '';
const h3Colors = h3xml.match(/<w:color[^/]*(\/?>)/g) || [];
const h3Counts = {};
h3Colors.forEach(function(m) {
  const val = (m.match(/w:val="([^"]+)"/) || [])[1];
  if (val) h3Counts[val] = (h3Counts[val] || 0) + 1;
});
Object.entries(h3Counts).sort().forEach(function([color, count]) {
  const flag = color === 'FFFFFF' || color === 'ffffff' ? ' <-- BLANCO' : '';
  console.log('  #' + color + ' x' + count + flag);
});
