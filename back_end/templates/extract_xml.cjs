// Muestra el XML crudo alrededor de los parrafos 8 y 10 (los primeros problematicos)
// para entender que estructura tienen y por que no tienen </w:p>
const fs = require('fs');
const PizZip = require('pizzip');

const content = fs.readFileSync('./templates/hoja_de_vida_template.docx', 'binary');
const zip = new PizZip(content);
const xml = zip.file('word/document.xml').asText();

// Guardar XML completo para inspeccion
fs.writeFileSync('./templates/document_extracted.xml', xml, 'utf8');
console.log('XML completo guardado en templates/document_extracted.xml (' + xml.length + ' bytes)');

// Mostrar los primeros 3 parrafos problematicos con contexto
const segments = xml.split('<w:p ');
[8, 10, 13].forEach(function(idx) {
  const seg = segments[idx];
  if (!seg) return;
  // Mostrar primeros 600 chars del segmento
  console.log('\n====== Parrafo #' + idx + ' (primeros 600 chars) ======');
  console.log(seg.substring(0, 600));
});
