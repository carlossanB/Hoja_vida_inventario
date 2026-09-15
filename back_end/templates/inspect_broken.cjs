const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('./templates/hoja_de_vida_template.docx', 'binary');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();

// Dividimos el XML por cada apertura de parrafo
const segments = xml.split('<w:p ');
console.log('Total segmentos de parrafo:', segments.length - 1);

let problemCount = 0;
segments.slice(1).forEach(function(seg, idx) {
  const closeIdx = seg.indexOf('</w:p>');
  const nextOpenIdx = seg.indexOf('<w:p ');

  if (closeIdx === -1) {
    const text = seg.replace(/<[^>]+>/g, '').substring(0, 80).trim();
    console.log('  [SIN CIERRE] Parrafo #' + (idx + 1) + ' Texto: ' + JSON.stringify(text));
    problemCount++;
  } else if (nextOpenIdx !== -1 && nextOpenIdx < closeIdx) {
    const text = seg.replace(/<[^>]+>/g, '').substring(0, 80).trim();
    console.log('  [ANIDADO]    Parrafo #' + (idx + 1) + ' Texto: ' + JSON.stringify(text));
    problemCount++;
  }
});

console.log('\nTotal parrafos problematicos:', problemCount);

// Detectar GUIDs de imagenes/smartart que docxtemplater puede confundir con variables
const guids = xml.match(/\{[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\}/gi) || [];
console.log('\n=== GUIDs encontrados (imagenes/smartart/bookmarks) ===');
console.log('Cantidad:', guids.length);
guids.forEach(function(g) { console.log('  ' + g); });
