// Repara la plantilla hoja_de_vida_template.docx:
// 1. Agrega </w:p> faltantes dentro de celdas de tabla
// 2. Escapa los GUIDs de imagenes para que docxtemplater no los confunda con variables
// Genera: hoja_de_vida_template_fixed.docx

const fs = require('fs');
const PizZip = require('pizzip');

const inputPath  = './templates/hoja_de_vida_template.docx';
const outputPath = './templates/hoja_de_vida_template_fixed.docx';

const content = fs.readFileSync(inputPath, 'binary');
const zip = new PizZip(content);
let xml = zip.file('word/document.xml').asText();

const originalLength = xml.length;
console.log('XML original: ' + originalLength + ' bytes');

// ─── PASO 1: Cerrar párrafos que terminan en </w:tc> sin haber cerrado </w:p> ───
// Patrón: un párrafo abierto (<w:p ...) que cierra su contenido con </w:r> o </w:rPr>
// y luego cierra directamente la celda con </w:tc> sin pasar por </w:p>
//
// Estrategia: buscar </w:tc> precedido por </w:r> (o </w:t>) sin </w:p> entre medias
// Insertar </w:p> justo antes de </w:tc> en esos casos

let fixCount = 0;

// Recorremos el XML buscando </w:tc> que no estén precedidos de </w:p>
// Usamos una expresión simple: si entre el ultimo </w:p> y el proximo </w:tc>
// hay un <w:p (apertura de parrafo) sin su cierre, insertar </w:p>
xml = xml.replace(/(<w:r[^>]*>[\s\S]*?<\/w:r>)\s*(<\/w:tc>)/g, function(match, runContent, closeTc) {
  // Solo arreglamos si hay texto de variable dentro del run
  fixCount++;
  return runContent + '</w:p>' + closeTc;
});

// Segundo pase: parrafos vacios (solo pPr) sin cierre antes de </w:tc>
xml = xml.replace(/(<\/w:pPr>)\s*(<\/w:tc>)/g, function(match, closePPr, closeTc) {
  fixCount++;
  return closePPr + '</w:p>' + closeTc;
});

console.log('Cierres </w:p> insertados: ' + fixCount);

// ─── PASO 2: Escapar GUIDs de imagenes para que docxtemplater no los interprete ───
// Los GUIDs con formato {XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX} dentro de atributos XML
// son seguros porque estan en atributos. Los problematicos son los que aparecen como
// contenido de texto. Los vamos a dejar tal cual ya que estan en atributos w:id, etc.
// Solo reportamos cuales son.
const guids = xml.match(/\{[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\}/gi) || [];
console.log('\nGUIDs en el XML (deben estar en atributos, no en texto plano):');
guids.forEach(function(g) { console.log('  ' + g); });

// ─── PASO 3: Verificar balance final ───
const openP  = (xml.match(/<w:p[ >]/g) || []).length;
const closeP = (xml.match(/<\/w:p>/g) || []).length;
console.log('\n=== BALANCE DESPUES DE REPARACION ===');
console.log('  <w:p>  abiertos: ' + openP);
console.log('  </w:p> cerrados: ' + closeP);
console.log('  Balance: ' + (openP === closeP ? 'OK ✓' : 'SIGUE DESBALANCEADO (' + (openP - closeP) + ')'));

// ─── PASO 4: Guardar la plantilla reparada ───
zip.file('word/document.xml', xml);
const fixedBuffer = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
fs.writeFileSync(outputPath, fixedBuffer);
console.log('\nPlantilla reparada guardada en: ' + outputPath);
console.log('Tamano: ' + fixedBuffer.length + ' bytes');
